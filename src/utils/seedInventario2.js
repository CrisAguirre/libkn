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
const PRODUCTOS = [
    //creamhelado
    ['Helado casero sabores', 'HEL', '11', 2019, 2500, 24, 5],
    ['Galleta con helado Napolitano', 'HEL', '11', 2820, 3500, 24, 5],
    ['Vaso aloja', 'HEL', '11', 3645, 4500, 24, 5],
    ['Paleta aloja sabores', 'HEL', '11', 1625, 2000, 24, 5],
    ['Paleta aloja Mix', 'HEL', '11', 2180, 2700, 24, 5],
    ['Galleta con helado Jumbo', 'HEL', '11', 3220, 4000, 24, 5],
    ['Chococono Mini', 'HEL', '11', 1941, 2500, 24, 5],
    ['Chococono', 'HEL', '11', 2820, 3500, 24, 5],
    ['Chococono Chococrispis', 'HEL', '11', 3533, 4500, 24, 5],
    ['Paleta Chocolisto', 'HEL', '11', 2026, 2500, 24, 5],
    ['Helado artesanal sabores', 'HEL', '11', 2784, 3500, 24, 5],
    ['Polet sabores grande', 'HEL', '11', 5715, 7000, 24, 5],
    ['Pole cookies - frutas', 'HEL', '11', 4904, 6000, 24, 5],
    ['Paleta Tosh', 'HEL', '11', 3026, 4000, 24, 5],
    ['Bocatto', 'HEL', '11', 4462, 5700, 24, 5],
    ['Helado vaso sabores', 'HEL', '11', 800, 1000, 24, 5],
    ['Creremositos', 'HEL', '11', 216, 600, 24, 5],
    ['Bonice Mini', 'HEL', '11', 400, 500, 24, 5],
    ['Bonice doble sabor', 'HEL', '11', 550, 800, 24, 5],
    ['Dispaleta sabores', 'HEL', '11', 200, 300, 24, 5],
    ['Paleta Jet', 'HEL', '11', 4072, 5000, 24, 5],
    ['Paleta Gol', 'HEL', '11', 2846, 3500, 24, 5],
    ['Bom bom bum vaso', 'HEL', '11', 3500, 4000, 24, 5],
    ['Helado Nucita', 'HEL', '11', 1800, 2200, 24, 5],
    ['Bon bon bum', 'HEL', '11', 1800, 2200, 24, 5],
    ['Paleta choco break - cookies', 'HEL', '11', 3000, 4000, 24, 5],

    //sevillana
    ['Chorizo Antioqueño x6', 'CAR', '40', 4600, 5500, 24, 5],
    ['Hamburguesa x5', 'CAR', '40', 4300, 5000, 24, 5],
    ['Jamón 500 gr', 'CAR', '40', 6200, 7000, 24, 5],
    ['Chorizo Paisa x10', 'CAR', '40', 7500, 8500, 24, 5],
    ['Salchicha Super unidad', 'CAR', '40', 550, 800, 24, 5],
    ['Salchichón de pollo 250 gr', 'CAR', '40', 2350, 2800, 24, 5],
    ['Salchichón de pollo 950 gr', 'CAR', '40', 4500, 5000, 24, 5],
    ['Hamburguesa x12', 'CAR', '40', 7500, 8000, 24, 5],
    ['Hamburguesa x17', 'CAR', '40', 6000, 7000, 24, 5],
    ['Jamón 250 gr', 'CAR', '40', 3200, 3800, 24, 5],
    ['Salchicha Llanera x10', 'CAR', '40', 6700, 7800, 24, 5],
    ['Salchichón Paisa x6', 'CAR', '40', 4300, 5000, 24, 5],
    ['Picada', 'CAR', '40', 6000, 7000, 24, 5],
    ['Salchicha Viera x15', 'CAR', '40', 4700, 5500, 24, 5],
    ['Cherizo Santa Rosano', 'CAR', '40', 12000, 14000, 24, 5],

    //colanta
    [' Jamón 143 gr', 'CAR', '32', 5100, 6000, 24, 5],
    [' Mortadela 105 gr ', 'CAR', '32', 2600, 3000, 24, 5],
    [' Salchicha Tripack 143 gr', 'CAR', '32', 5500, 6500, 24, 5],
    [' Salchicha Duopack 450 gr ', 'CAR', '32', 2200, 2600, 24, 5],
    [' Salchichón Cervecero', 'CAR', '32', 1350, 1600, 24, 5],


];


async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('\n✅ Conectado a MongoDB');
        // await Product.deleteMany({}); // Preserving existing inventory
        console.log('✅ Conservando productos anteriores, se agregarán los nuevos.');

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

        for (const [name, catCode, provCode, salePriceRaw, purchasePriceRaw, stock, minStock] of PRODUCTOS) {
            const catId = catMap[catCode];
            if (!catId) { console.log(`   ⚠️ Categoría no encontrada para el código: ${catCode} (Producto: ${name})`); continue; }

            const provId = provMap[provCode];
            if (!provId) { console.log(`   ⚠️ Proveedor no encontrado para el código: ${provCode} (Producto: ${name})`); continue; }

            // Ensure numeric values and correct ordering (salePrice > purchasePrice)
            let salePrice = salePriceRaw || 0;
            let purchasePrice = purchasePriceRaw || 0;
            if (salePrice && purchasePrice && salePrice <= purchasePrice) {
                // Swap to maintain sale > purchase
                const temp = salePrice;
                salePrice = purchasePrice;
                purchasePrice = temp;
            }

            if (!providerConsecutives[provCode]) {
                providerConsecutives[provCode] = 1;
            }
            let consecutive = providerConsecutives[provCode]++;

            // Generar barcode: CAT(3) + PROV(2) + CONSEC(3)
            let barcode = `${catCode}${provCode}${consecutive.toString().padStart(3, '0')}`;

            // Check if product with this barcode already exists and find next available
            while (await Product.findOne({ barcode })) {
                consecutive = providerConsecutives[provCode]++;
                barcode = `${catCode}${provCode}${consecutive.toString().padStart(3, '0')}`;
            }

            await Product.create({
                name,
                barcode,
                category: catId,
                supplier: provId,
                purchasePrice: purchasePrice,
                salePrice: salePrice,
                stock: stock || 0,
                minStock: minStock || 0
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