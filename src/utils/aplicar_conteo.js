/**
 * Aplica el conteo de fotos como STOCK REAL (reemplazo, no suma).
 * Criterio del negocio: el sistema tenia cantidades supuestas; la foto manda.
 *
 * Uso:
 *   node src/utils/aplicar_conteo.js --dry-run   (solo informa, no escribe)
 *   node src/utils/aplicar_conteo.js --apply      (reemplaza stock + audita)
 *
 * Requiere MONGODB_URI en .env. Lee ../scanner/conteo_total_final.json.
 * - Solo toca productos que EMPAREJAN por nombre (insensible a caso/inclusivo).
 * - Familias sin producto en BD se listan para crearlas primero (no se inventan).
 * - Zonas AUTO (clases genericas bottle/bag) NO se aplican a SKU: se reportan
 *   para mapeo clase->producto antes de tocar stock.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const StockCount = require('../models/StockCount');

const FILE = path.join(__dirname, '../../scanner/conteo_total_final.json');
const APPLY = process.argv.includes('--apply');

function norm(s) {
  return String(s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

async function findProduct(familyName) {
  const n = norm(familyName).split('(')[0].trim();
  const tokens = n.split(/[^a-z0-9]+/).filter((t) => t.length > 2);
  const brand = tokens.slice(0, 2).join(' ');
  let p = await Product.findOne({ name: { $regex: `^${brand.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, $options: 'i' } });
  if (p) return { product: p, exact: false };
  const first = tokens[0] || n;
  const cands = await Product.find({ name: { $regex: first, $options: 'i' } }).limit(20);
  const hit = cands.find((c) => norm(c.name).includes(n) || n.includes(norm(c.name)));
  return { product: hit || null, exact: false };
}

async function main() {
  const data = JSON.parse(fs.readFileSync(FILE, 'utf8'));
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Conectado. Modo:', APPLY ? 'APLICAR (reemplazo)' : 'DRY-RUN');

  let updated = 0, skippedAuto = 0;
  const unmatched = [];
  const zonaAuto = [];

  for (const [zone, zd] of Object.entries(data.zonas)) {
    const fams = zd.familias;
    if (!fams) {
      skippedAuto += zd.total;
      zonaAuto.push({ zona: zone, total: zd.total, fotos: zd.fotos });
      continue; // zona AUTO: clases genericas, requiere mapeo SKU primero
    }
    for (const f of fams) {
      const { product } = await findProduct(f.producto);
      if (!product) {
        unmatched.push({ zona: zone, familia: f.producto, conteo: f.count });
        continue;
      }
      if (!APPLY) {
        console.log(`[dry] zona ${zone} "${f.producto}" -> ${product.name} := ${f.count} (hoy ${product.stock})`);
        continue;
      }
      const oldStock = product.stock;
      if (oldStock === f.count) continue;
      product.stock = f.count; // LA FOTO MANDA: reemplazo total
      await product.save();
      await StockCount.create({
        product: product._id,
        productName: product.name,
        oldStock,
        counted: f.count,
        newStock: f.count,
        difference: f.count - oldStock,
        source: 'scan',
        createdBy: undefined,
      });
      updated++;
      console.log(`[ok] zona ${zone} ${product.name}: ${oldStock} -> ${f.count}`);
    }
  }

  console.log('\n==== RESUMEN ====');
  console.log('Productos actualizados:', updated);
  console.log('Unidades en zonas AUTO (pendiente mapeo SKU):', skippedAuto, JSON.stringify(zonaAuto.map((z) => z.zona)));
  console.log('Familias sin producto en BD (crear primero):', unmatched.length);
  unmatched.forEach((u) => console.log('  -', `zona ${u.zona}`, u.familia, '=', u.conteo));
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
