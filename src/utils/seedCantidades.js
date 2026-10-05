/**
 * SEED DE CANTIDADES REALES — La Inmaculada / Listore
 * Fuente: ../scanner/conteo_total_final.json (conteo foto por foto 2026-10-05,
 * corregido humano + IA; la foto manda, el sistema anterior era supuesto).
 *
 * Uso desde el backend (ahi si hay .env con MONGODB_URI):
 *   node src/utils/seedCantidades.js            (dry-run: solo informa)
 *   node src/utils/seedCantidades.js --apply    (reemplaza stock + audita)
 *
 * Que hace en --apply:
 *  - Por cada familia del conteo busca el Product (MAPEO exacto > nombre exacto
 *    insensible a caso > barcode > difuso) y pone stock = conteo (REEMPLAZO).
 *  - Crea StockCount {oldStock, counted, newStock, difference, source:'scan'}.
 *  - NO crea productos: lo no emparejado se lista para crearlo primero.
 *  - Zonas AUTO (25, 33, 34, 36: clases genericas) solo se aplican si estan en
 *    REPARTO_ZONAS_AUTO con el desglose a SKU que usted confirme.
 *  - Fusion 27-28 se aplica una sola vez (128), no 114+67.
 *
 * Para ajustar emparejamientos edite MAPEO y REPARTO_ZONAS_AUTO abajo.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const StockCount = require('../models/StockCount');

const FILE = process.env.SEED_FILE || path.join(__dirname, '../../scanner/conteo_total_final.json');
const APPLY = process.argv.includes('--apply');

// Familia (subcadena, minusculas sin tildes) -> nombre EXACTO en BD.
// Agregue aqui los casos que el difuso no resuelva tras el primer --dry-run.
const MAPEO = {
  // Lote certero 2026-10-05 (verificado contra catalogo real, SKU unico):
  'mermelada san jorge': 'Mermelada San Jorge 80 gr',
  'vanish': 'Vanish Rosa 130 ml',
  'solla conejo': 'Solla Conejos 1 Kg',
  'zucaritas': 'Zucaritas',
  'budweiser': 'Budweiser Lata 269 ml',
  'atun van camps': 'Atun Van Camps lomitos',
  'atun mar brava': 'Atun Mar brava lomitos',
  'temperas': 'Temperas caja',
  'talco yodora': 'Talco Yodora 60gr',
  'bianchi': 'Barra bianchi mini',
  'hit caja': 'Jugo hit caja 1 L',
  'chococono': 'Chococono',
  'cafe aguila roja': 'Café Aguila Roja 500 gr',
  'menta helada': 'Menta helada unidad',
  'leche klim': 'Leche Klin 25 gr',
  'te suntea': 'Suntea 12 Gr',
  'blancox botellas': 'Blanqueador Blancox 500 ml',
  'ariel': 'Ariel regular 100 gr',
  'promasa': 'Promasa blanca 500 gr',
  'cherry': 'Betun Cherry pequeño colores',
};

// Zonas AUTO (clases genericas de la IA) -> reparto manual a SKU.
// Formato: zona: [{ producto: 'Nombre exacto en BD', count: N }, ...]
// Mientras una zona AUTO no este aqui, el seed la REPORTA pero no la toca.
const REPARTO_ZONAS_AUTO = {
  // '25': [{ producto: 'Aguardiente Antioqueno', count: 20 }, ...],
};

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

async function findProduct(familyName) {
  const key = norm(familyName).split('(')[0].trim();
  if (MAPEO[key]) {
    const p = await Product.findOne({ name: MAPEO[key] });
    if (p) return { product: p, via: 'MAPEO' };
  }
  let p = await Product.findOne({ name: { $regex: `^${key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, $options: 'i' } });
  if (p) return { product: p, via: 'exacto' };
  p = await Product.findOne({ barcode: key });
  if (p) return { product: p, via: 'barcode' };
  const tokens = key.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  if (!tokens.length) return { product: null };
  const cands = await Product.find({ name: { $regex: tokens[0], $options: 'i' } }).limit(20);
  const hit = cands.find((c) => {
    const cn = norm(c.name);
    return cn.includes(key) || key.includes(cn);
  });
  return { product: hit || null, via: hit ? 'difuso' : null };
}

async function applyLine(zona, nombre, conteo, viaNota) {
  const { product, via } = await findProduct(nombre);
  if (!product) return { ok: false, nombre, conteo, zona };
  if (!APPLY) {
    console.log(`[dry] zona ${zona} "${nombre}" -> "${product.name}" := ${conteo} (hoy ${product.stock}) [${via}]`);
    return { ok: true, dry: true };
  }
  const oldStock = product.stock;
  if (oldStock !== conteo) {
    product.stock = conteo; // LA FOTO MANDA
    await product.save();
    await StockCount.create({
      product: product._id,
      productName: product.name,
      oldStock,
      counted: conteo,
      newStock: conteo,
      difference: conteo - oldStock,
      source: 'scan',
    });
    console.log(`[ok] zona ${zona} "${product.name}": ${oldStock} -> ${conteo} [${via}]`);
    return { ok: true, updated: oldStock !== conteo };
  }
  return { ok: true, updated: false };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado. Modo:', APPLY ? 'APLICAR (reemplazo + auditoria)' : 'DRY-RUN (sin escribir)');

  let updated = 0, same = 0;
  const unmatched = [];
  const pendientesAuto = [];

  const fusionadas = new Set();
  for (const [fkey, fz] of Object.entries(data.fusiones || {})) {
    fz.zonas.forEach((z) => fusionadas.add(z));
    console.log(`-- Fusion ${fkey} = ${fz.total} (no se suman partes) --`);
    // La fusion es un total de vitrina sin desglose SKU: se reporta para MAPEO.
    pendientesAuto.push({ zona: fkey, total: fz.total, nota: fz.nota });
  }

  for (const [zone, zd] of Object.entries(data.zonas)) {
    if (fusionadas.has(zone)) continue;
    if (!zd.familias) {
      const reparto = REPARTO_ZONAS_AUTO[zone];
      if (!reparto) {
        pendientesAuto.push({ zona: zone, total: zd.total, fotos: zd.fotos });
        continue;
      }
      for (const r of reparto) {
        const res = await applyLine(zone, r.producto, r.count, 'reparto');
        if (res.updated) updated++;
        else if (res.ok) same++;
        else unmatched.push({ zona: zone, familia: r.producto, conteo: r.count });
      }
      continue;
    }
    for (const f of zd.familias) {
      const res = await applyLine(zone, f.producto, f.count);
      if (res.updated) updated++;
      else if (res.ok) same++;
      else unmatched.push({ zona: zone, familia: f.producto, conteo: f.count });
    }
  }

  console.log('\n==== RESUMEN ====');
  console.log('Productos actualizados:', updated, '| sin cambio:', same);
  console.log('Zonas AUTO/fusion pendientes de MAPEO:', JSON.stringify(pendientesAuto.map((p) => p.zona || p)));
  console.log('Familias sin producto en BD (crear primero):', unmatched.length);
  unmatched.forEach((u) => console.log('  -', `zona ${u.zona}`, `"${u.familia}"`, '=', u.conteo));
  console.log('\nTip: agregue los faltantes a MAPEO / REPARTO_ZONAS_AUTO y repita.');
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
