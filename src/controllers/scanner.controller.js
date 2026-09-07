const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const Product = require('../models/Product');

const SCANNER_SCRIPT = path.join(__dirname, '../../scanner/api.py');
const SCANNER_PORT = process.env.SCANNER_PORT || 5000;
const SCANNER_URL = `http://localhost:${SCANNER_PORT}`;

let scannerProcess = null;

async function startScannerServer() {
  if (scannerProcess) return;

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

  await new Promise((resolve) => setTimeout(resolve, 3000));
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
      body: JSON.stringify(payload)
    });

    const result = await response.json();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

exports.scanAndUpdateInventory = async (req, res, next) => {
  try {
    const { image, image_path, update_stock = true } = req.body;

    if (!image && !image_path) {
      return res.status(400).json({ success: false, error: 'Se requiere imagen (base64) o image_path' });
    }

    if (!isScannerRunning()) {
      await startScannerServer();
    }

    const fetch = (await import('node-fetch')).default;

    const payload = image ? { image } : { image_path };
    const scanResponse = await fetch(`${SCANNER_URL}/scan`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const scanResult = await scanResponse.json();

    if (!scanResult.success) {
      return res.status(500).json(scanResult);
    }

    if (!update_stock) {
      return res.json({ ...scanResult, stock_updated: false });
    }

    const updatedProducts = [];
    const errors = [];

    for (const detected of scanResult.products) {
      const productName = detected.name.toLowerCase().trim();

      let product = await Product.findOne({
        $or: [
          { name: { $regex: productName, $options: 'i' } },
          { barcode: productName }
        ]
      });

      if (product) {
        const diff = detected.count - product.stock;
        if (diff !== 0) {
          product.stock = detected.count;
          await product.save();
          updatedProducts.push({
            product: product.name,
            old_stock: product.stock - diff,
            new_stock: detected.count,
            difference: diff
          });
        }
      } else {
        errors.push({ name: detected.name, count: detected.count, error: 'Producto no encontrado en BD' });
      }
    }

    res.json({
      ...scanResult,
      stock_updated: true,
      updated_products: updatedProducts,
      unmapped_products: errors
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
