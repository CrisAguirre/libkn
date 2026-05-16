/**
 * SEED DE INVENTARIO FICTICIO — DEMOSTORE
 * Ejecutar: node src/utils/seedInventario.js
 * 
 * Para inventario real: editar los arrays de productos con
 * los datos de tu toma física, luego ejecutar.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');


// ─── Arreglo de Productos para Inyección ─────────────────────────
// Formato: ['Nombre del Producto', 'COD_CATEGORIA', 'COD_PROVEEDOR', precioCompra, precioVenta, stock, minStock]
// Ejemplo: ['Coca Cola 350ml', 'BEB', '07', 1500, 2000, 48, 12]
const PRODUCTOS = [
  ['Coca Cola 400 ml', 'BEB', '07', 3000, 2500, 24, 5],
  ['Quatro 400 ml', 'BEB', '07', 2500, 2091, 24, 5],
  [' Coca-Cola 250 ml', 'BEB', '07', 1500, 1200, 24, 5],
  [' Quatro 250 ml', 'BEB', '07', 1500, 1200, 24, 5],
  [' Powerade 500 ml', 'BEB', '07', 3500, 3166, 24, 5],
  [' Schweeps 400 ml', 'BEB', '07', 2500, 2091, 24, 5],
  [' Jugo del Valle 400 ml', 'BEB', '07', 2200, 1666, 24, 5],
  [' Sprite 400 ml', 'BEB', '07', 3000, 2500, 24, 5],
  [' Quatro 1.5 L', 'BEB', '07', 4500, 3750, 24, 5],
  [' Quatro 2.5 L', 'B A EB', '07', 1500, 2000, 24, 5],
  [' Coca Cola 1.5 L', 'BEB', '07', 1500, 2000, 24, 5],
  [' Coca Cola 3L', 'BEB', '07', 1500, 2000, 24, 5],
  [' Coca Cola 1L', 'BEB', '07', 1500, 2000, 24, 5],
  ['', 'BEB', '07', 1500, 2000, 24, 5],
  ['', 'BEB', '07', 1500, 2000, 24, 5],
  ['', 'BEB', '07', 1500, 2000, 24, 5],
  ['', 'BEB', '07', 1500, 2000, 24, 5],
  ['', 'BEB', '07', 1500, 2000, 24, 5],
  ['', 'BEB', '07', 1500, 2000, 24, 5],
  ['', 'BEB', '07', 1500, 2000, 24, 5],
];


async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Conectado a MongoDB');
    await Product.deleteMany({});
    console.log('🧹 Limpiando productos anteriores...');

    console.log('📂 Cargando categorías desde la base de datos...');
    const categoriasDB = await Category.find();
    const catMap = {}; // catCode -> catId
    for (const cat of categoriasDB) {
      catMap[cat.code] = cat._id;
    }

    console.log('🚚 Cargando proveedores desde la base de datos...');
    const proveedoresDB = await Supplier.find();
    const provMap = {}; // provCode -> provId
    for (const prov of proveedoresDB) {
      provMap[prov.code] = prov._id;
    }

    // Crear productos
    console.log('\n📦 Creando productos...');
    let totalCreados = 0;
    const providerConsecutives = {};

    for (const [name, catCode, provCode, purchasePrice, salePrice, stock, minStock] of PRODUCTOS) {
      const catId = catMap[catCode];
      if (!catId) { console.log(`   ⚠️ Categoría no encontrada para el código: ${catCode} (Producto: ${name})`); continue; }

      const provId = provMap[provCode];
      if (!provId) { console.log(`   ⚠️ Proveedor no encontrado para el código: ${provCode} (Producto: ${name})`); continue; }

      if (!providerConsecutives[provCode]) {
        providerConsecutives[provCode] = 1;
      }
      const consecutive = providerConsecutives[provCode]++;

      // Generar barcode: CAT(3) + PROV(2) + CONSEC(3)
      // Ejemplo: BEB + 07 + 001 = BEB07001
      const barcode = `${catCode}${provCode}${consecutive.toString().padStart(3, '0')}`;

      await Product.create({
        name,
        barcode,
        category: catId,
        supplier: provId,
        purchasePrice,
        salePrice,
        stock,
        minStock
      });

      totalCreados++;
    }

    const total = await Product.countDocuments();
    const sinStock = await Product.countDocuments({ stock: 0 });
    const stockBajo = await Product.countDocuments({ $expr: { $lte: ['$stock', '$minStock'] } });
    const valorCosto = await Product.aggregate([{ $group: { _id: null, v: { $sum: { $multiply: ['$stock', '$purchasePrice'] } } } }]);
    const valorVenta = await Product.aggregate([{ $group: { _id: null, v: { $sum: { $multiply: ['$stock', '$salePrice'] } } } }]);

    console.log(`\n📊 RESUMEN DEL INVENTARIO FICTICIO:`);
    console.log(`   Total productos : ${total}`);
    console.log(`   Sin stock       : ${sinStock}`);
    console.log(`   Stock bajo      : ${stockBajo}`);
    console.log(`   Valor en costo  : $${(valorCosto[0]?.v || 0).toLocaleString('es-CO')}`);
    console.log(`   Valor en venta  : $${(valorVenta[0]?.v || 0).toLocaleString('es-CO')}`);
    console.log(`\n🚀 Seed completado: ${totalCreados} productos cargados\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();