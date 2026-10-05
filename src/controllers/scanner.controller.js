const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');
const StockCount = require('../models/StockCount');

const SCANNER_SCRIPT = path.join(__dirname, '../../scanner/api.py');
const SCANNER_PORT = process.env.SCANNER_PORT || 5000;
const SCANNER_URL = process.env.SCANNER_URL || `http://localhost:${SCANNER_PORT}`;
const SCANNER_TIMEOUT_MS = parseInt(process.env.SCANNER_TIMEOUT_MS || '30000', 10);

let scannerProcess = null;

async function waitForScannerReady(tries = 10) {
  const fetch = (await import('node-fetch')).default;
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(`${SCANNER_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (r.ok) return true;
    } catch {
      // reintentar
    }
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return false;
}

async function startScannerServer() {
  if (scannerProcess) {
    const ready = await waitForScannerReady(3);
    if (ready) return;
  }

  const python = process.platform === 'win32' ? 'python' : 'python3';

  scannerProcess = spawn(python, [SCANNER_SCRIPT], {
    cwd: path.dirname(SCANNER_SCRIPT),
    stdio: ['ignore', 'pipe', 'pipe']
  });

  scannerProcess.stdout.on('data', (data) => {
    console.log(`[Scanner] ${data.toString().trim()}`);
  });

  scannerProcess.stderr.on('data', (data) => {
    console.error(`[Scanner Error] ${data.toString().trim()}`);
  });

  scannerProcess.on('close', (code) => {
    console.log(`[Scanner] Servidor cerrado con código ${code}`);
    scannerProcess = null;
  });

  const ready = await waitForScannerReady(15);
  if (!ready) {
    scannerProcess = null;
    throw new Error('Scanner no respondió al healthcheck (revisa python, dependencias y puerto)');
  }
}

// Mapeo exacto primero para evitar falsos positivos del includes()
// Orden: 1) barcode exacto, 2) nombre exacto insensible a caso, 3) fallback parcial (marcado ambiguo)
async function findProductForDetection(detectedName) {
  const raw = String(detectedName || '').trim();
  if (!raw) return { product: null, ambiguous: true };

  const byBarcode = await Product.findOne({ barcode: raw });
  if (byBarcode) return { product: byBarcode, ambiguous: false };

  const exactName = await Product.findOne({ name: { $regex: `^${raw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
  if (exactName) return { product: exactName, ambiguous: false };

  const normalized = raw.toLowerCase().replace(/[_-]+/g, ' ');
  const candidates = await Product.find({ name: { $regex: normalized.split(' ')[0] || raw, $options: 'i' } }).limit(10);
  const includes = candidates.filter((p) => {
    const pn = p.name.toLowerCase();
    return pn.includes(normalized) || normalized.includes(pn);
  });
  if (includes.length === 1) return { product: includes[0], ambiguous: true };
  return { product: null, ambiguous: true, candidates: includes.length };
}

function isScannerRunning() {
  return scannerProcess && !scannerProcess.killed;
}

exports.startScanner = async (req, res, next) => {
  try {
    if (isScannerRunning()) {
      return res.json({ success: true, message: 'Scanner ya está corriendo', url: SCANNER_URL });
    }

    await startScannerServer();
    res.json({ success: true, message: 'Scanner iniciado', url: SCANNER_URL });
  } catch (error) {
    next(error);
  }
};

exports.stopScanner = async (req, res, next) => {
  try {
    if (scannerProcess) {
      scannerProcess.kill();
      scannerProcess = null;
    }
    res.json({ success: true, message: 'Scanner detenido' });
  } catch (error) {
    next(error);
  }
};

exports.scanImage = async (req, res, next) => {
  try {
    const { image, image_path } = req.body;

    if (!image && !image_path) {
      return res.status(400).json({ success: false, error: 'Se requiere imagen (base64) o image_path' });
    }

    if (!isScannerRunning()) {
      await startScannerServer();
    }

    const fetch = (await import('node-fetch')).default;

    const payload = image ? { image } : { image_path };
    const response = await fetch(`${SCANNER_URL}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(SCANNER_TIMEOUT_MS)
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.scanAndUpdateInventory = async (req, res, next) => {
  try {
    const { image, image_path, update_stock = true, products: confirmedProducts } = req.body;

    let scanResult;
    let reusedInference = false;

    if (Array.isArray(confirmedProducts) && confirmedProducts.length > 0) {
      // Reutiliza la inferencia ya confirmada en pantalla: evita el doble escaneo
      scanResult = { success: true, products: confirmedProducts, reusedInference: true };
      reusedInference = true;
    } else {
      if (!image && !image_path) {
        return res.status(400).json({ success: false, error: 'Se requiere imagen (base64) o image_path, o la lista products confirmada' });
      }

      if (!isScannerRunning()) {
        await startScannerServer();
      }

      const fetch = (await import('node-fetch')).default;

      const payload = image ? { image } : { image_path };
      const scanResponse = await fetch(`${SCANNER_URL}/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(SCANNER_TIMEOUT_MS)
      });

      scanResult = await scanResponse.json();

      if (!scanResult.success) {
        return res.status(500).json(scanResult);
      }
    }

    if (!update_stock) {
      return res.json({ ...scanResult, stock_updated: false });
    }

    const updatedProducts = [];
    const errors = [];

    for (const detected of scanResult.products) {
      const { product, ambiguous } = await findProductForDetection(detected.name);

      if (product) {
        const counted = Number(detected.count) || 0;
        const diff = counted - product.stock;
        if (diff !== 0) {
          const oldStock = product.stock;
          product.stock = counted;
          await product.save();
          // Auditoría: quién contó, cuánto había, cuánto vio la cámara
          await StockCount.create({
            product: product._id,
            productName: product.name,
            oldStock,
            counted,
            newStock: counted,
            difference: diff,
            source: 'scan',
            confidence: typeof detected.confidence === 'number' ? detected.confidence : undefined,
            createdBy: req.user?._id || req.user?.id
          });
          updatedProducts.push({
            product: product.name,
            productId: product._id,
            old_stock: oldStock,
            new_stock: counted,
            difference: diff,
            confidence: detected.confidence,
            ambiguous: !!ambiguous
          });
        }
      } else {
        errors.push({ name: detected.name, count: detected.count, confidence: detected.confidence, error: 'Producto no encontrado en BD (verifica el mapeo clase→producto)' });
      }
    }

    res.json({
      ...scanResult,
      reusedInference,
      stock_updated: true,
      updated_products: updatedProducts,
      unmapped_products: errors
    });
  } catch (error) {
    next(error);
  }
};

async function callScanner(pathname, payload, timeoutMs) {
  const fetch = (await import('node-fetch')).default;
  const response = await fetch(`${SCANNER_URL}${pathname}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(timeoutMs || SCANNER_TIMEOUT_MS)
  });
  return response.json();
}

function mergeZoneCounts(perPhoto) {
  // Regla de zona (2026-10-05): planos con igual numero base son
  // complementarios y SE SUMAN. Ej: 1 + 1b -> zona 1; 40 + 40a + 40b.
  const merged = {};
  let needsManual = false;
  for (const p of perPhoto) {
    if (!p.success) continue;
    if (p.needs_manual_rows || p.reliability === 'BAJA') needsManual = true;
    for (const prod of (p.products || [])) {
      merged[prod.name] = (merged[prod.name] || 0) + (Number(prod.count) || 0);
    }
  }
  return {
    merged_products: Object.entries(merged).map(([name, count]) => ({ name, count })),
    merged_total: Object.values(merged).reduce((a, b) => a + b, 0),
    needs_manual_rows: needsManual
  };
}

exports.scanAuto = async (req, res, next) => {
  try {
    const { image, image_path, annotate = false, conf_world, conf_coco } = req.body;
    if (!image && !image_path) {
      return res.status(400).json({ success: false, error: 'Se requiere imagen (base64) o image_path' });
    }
    if (!isScannerRunning()) {
      await startScannerServer();
    }
    const result = await callScanner('/scan-auto', { image, image_path, annotate, conf_world, conf_coco });
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.getZonesReport = async (req, res, next) => {
  try {
    // 1) intenta reporte vivo del servicio Python
    if (!isScannerRunning()) {
      await startScannerServer();
    }
    const fetch = (await import('node-fetch')).default;
    try {
      const r = await fetch(`${SCANNER_URL}/zones-report`, { signal: AbortSignal.timeout(5000) });
      if (r.ok) {
        const live = await r.json();
        return res.json(live);
      }
    } catch {
      // cae al archivo local
    }
    // 2) fallback: batch_result.json local generado por el batch
    const reportPath = path.join(__dirname, '../../scanner/batch_result.json');
    if (!fs.existsSync(reportPath)) {
      return res.status(404).json({ success: false, error: 'Sin reporte: ejecuta el batch sobre src/stock' });
    }
    const data = JSON.parse(fs.readFileSync(reportPath, 'utf8'));
    res.json({ success: true, ...data, source: 'local' });
  } catch (error) {
    next(error);
  }
};

// Sesion multifoto por zona: recibe N fotos (base64 o rutas locales del
// servidor), cuenta cada una con el motor auto y SUMA por zona.
exports.scanZoneSession = async (req, res, next) => {
  try {
    const { photos = [], zone = null, annotate = false, update_stock = false } = req.body;
    if (!Array.isArray(photos) || photos.length === 0) {
      return res.status(400).json({ success: false, error: 'Se requiere arreglo photos (base64 o image_path)' });
    }
    if (photos.length > 10) {
      return res.status(400).json({ success: false, error: 'Maximo 10 fotos por sesion de zona' });
    }
    if (!isScannerRunning()) {
      await startScannerServer();
    }
    const perPhoto = [];
    for (let i = 0; i < photos.length; i++) {
      const p = photos[i];
      const payload = typeof p === 'string'
        ? { image: p, annotate }
        : { image: p.image, image_path: p.image_path, annotate };
      try {
        const r = await callScanner('/scan-auto', payload);
        perPhoto.push({ index: i, file: p.file || p.image_path || `foto_${i + 1}`, ...r });
      } catch (e) {
        perPhoto.push({ index: i, success: false, error: e.message });
      }
    }
    const merged = mergeZoneCounts(perPhoto);

    if (!update_stock) {
      return res.json({ success: true, zone, per_photo: perPhoto, ...merged, stock_updated: false });
    }

    // Aplicacion a stock: SOLO con conteos confirmados por producto mapeado.
    // El modo auto de unidades genericas NO pisa Product.stock sin mapeo SKU.
    return res.json({
      success: true,
      zone,
      per_photo: perPhoto,
      ...merged,
      stock_updated: false,
      message: 'Conteo de unidades calculado. Para ajustar Product.stock confirma el mapeo clase->producto (SKU) o usa conteo manual por filas en zonas BAJA.'
    });
  } catch (error) {
    next(error);
  }
};

exports.getScannerStatus = async (req, res, next) => {
  try {
    const running = isScannerRunning();

    if (running) {
      const fetch = (await import('node-fetch')).default;
      try {
        const response = await fetch(`${SCANNER_URL}/health`);
        const health = await response.json();
        res.json({ success: true, running: true, url: SCANNER_URL, health });
      } catch {
        res.json({ success: true, running: false, url: SCANNER_URL });
      }
    } else {
      res.json({ success: true, running: false, url: SCANNER_URL });
    }
  } catch (error) {
    next(error);
  }
};

exports.listInventoryAssets = async (req, res, next) => {
  try {
    const assetsDir = path.join(__dirname, '../../scanner/assets/inventario');

    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
      return res.json({ success: true, categories: [] });
    }

    const categories = fs.readdirSync(assetsDir)
      .filter(name => {
        const itemPath = path.join(assetsDir, name);
        return fs.statSync(itemPath).isDirectory();
      })
      .map(name => {
        const itemPath = path.join(assetsDir, name);
        const files = fs.readdirSync(itemPath).filter(f => /\.(jpg|jpeg|png)$/i.test(f));
        return { name, image_count: files.length, path: `scanner/assets/inventario/${name}` };
      });

    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

// Subida real de imagen de referencia: guarda en scanner/assets/inventario/<slug>/
// y actualiza Product.imageUrl. Antes el frontend solo la guardaba en memoria.
exports.uploadReference = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ success: false, error: 'Producto no encontrado' });
    if (!req.file) return res.status(400).json({ success: false, error: 'Se requiere archivo de imagen' });

    const slug = product.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '_');
    const dir = path.join(__dirname, '../../scanner/assets/inventario', slug);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    const ext = path.extname(req.file.originalname || '.jpg').toLowerCase() || '.jpg';
    const dest = path.join(dir, `ref_${Date.now()}${ext}`);
    fs.writeFileSync(dest, req.file.buffer);

    product.imageUrl = `scanner/assets/inventario/${slug}/${path.basename(dest)}`;
    await product.save();

    res.json({ success: true, imageUrl: product.imageUrl, path: dest });
  } catch (error) {
    next(error);
  }
};
