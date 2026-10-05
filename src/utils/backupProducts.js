/**
 * Respaldo de products antes del seed de cantidades.
 * Uso (donde haya MONGODB_URI: PowerShell local o Render Shell):
 *   node src/utils/backupProducts.js
 * Genera: scanner/respaldo_products_AAAA-MM-DD_HHmm.json con todos los productos.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const Product = require('../models/Product');

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);
  const docs = await Product.find({}).lean();
  const stamp = new Date().toISOString().slice(0, 16).replace('T', '_').replace(':', '');
  const file = path.join(__dirname, `../../scanner/respaldo_products_${stamp}.json`);
  fs.writeFileSync(file, JSON.stringify(docs, null, 1), 'utf8');
  console.log(`Respaldo OK: ${docs.length} productos -> ${file}`);
  await mongoose.disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
