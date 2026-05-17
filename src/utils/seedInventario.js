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
  ['Coca-Cola 400 ml', 'BEB', '07', 3000, 2500, 24, 5],
  ['Quatro 400 ml', 'BEB', '07', 2500, 2091, 24, 5],
  ['Coca-Cola 250 ml', 'BEB', '07', 1500, 1200, 24, 5],
  ['Quatro 250 ml', 'BEB', '07', 1500, 1200, 24, 5],
  ['Powerade 500 ml', 'BEB', '07', 3500, 3166, 24, 5],
  ['Schweeps 400 ml', 'BEB', '07', 2500, 2091, 24, 5],
  ['Jugo del Valle 400 ml', 'BEB', '07', 2200, 1666, 24, 5],
  ['Sprite 400 ml', 'BEB', '07', 3000, 2500, 24, 5],
  ['Quatro 1.5L', 'BEB', '07', 4500, 3750, 24, 5],
  ['Quatro 2.5L', 'BEB', '07', 1500, 2000, 24, 5],
  ['Coca-Cola 1.5L', 'BEB', '07', 1500, 2000, 24, 5],
  ['Coca-Cola 3L', 'BEB', '07', 1500, 2000, 24, 5],
  ['Coca-Cola 1L', 'BEB', '07', 1500, 2000, 24, 5],
  ['Jugo del Valle 1.5L', 'BEB', '07', 1500, 2000, 24, 5],
  ['Jugo del Valle frutos rojos 1.5L', 'BEB', '07', 1500, 2000, 24, 5],
  ['Coca-Cola 2.5L', 'BEB', '07', 1500, 2000, 24, 5],
  ['Coca Cola 250 ml', 'BEB', '07', 1500, 2000, 24, 5],
  ['Coca Cola 400 ml cero azúcar', 'BEB', '07', 1500, 2000, 24, 5],
  ['Speedlata 310 ml', 'BEB', '05', 1500, 2000, 24, 5],
  ['Speed Botella plástico 250 ml', 'BEB', '05', 1500, 2000, 24, 5],
  ['Postobon sabores 1 L', 'BEB', '05', 1500, 2000, 24, 5],
  ['Postobón sabores 1 L', 'BEB', '05', 1500, 2000, 24, 5],
  ['Postobón sabores 2 L', 'BEB', '05', 1500, 2000, 24, 5],
  ['H2O 1.5L', 'BEB', '05', 1500, 2000, 24, 5],
  ['H2O 600 ml', 'BEB', '05', 1500, 2000, 24, 5],
  ['Postobón sabores 3 L', 'BEB', '05', 1500, 2000, 24, 5],
  ['Postobón sabores 250 ml', 'BEB', '05', 1500, 2000, 24, 5],
  ['Jugo hit caja 1 L', 'BEB', '05', 1500, 2000, 24, 5],
  ['Jugo hit botella 1 L', 'BEB', '05', 1500, 2000, 24, 5],
  ['Gatorade 500 ml', 'BEB', '05', 1500, 2000, 24, 5],
  ['H2O 250 ml', 'BEB', '05', 1500, 2000, 24, 5],
  ['Bretaña 250 ml', 'BEB', '05', 1500, 2000, 24, 5],
  ['Bretaña 1.5 L', 'BEB', '05', 1500, 2000, 24, 5],
  [' Agua cristal 600 ml', 'BEB', '05', 1500, 2000, 24, 5],
  [' Agua cristal 1 L', 'BEB', '05', 1500, 2000, 24, 5],
  [' Poker litrazo Botella vidrio', 'BEB', '08', 1500, 2000, 24, 5],
  [' Poker lata 330 ml', 'BEB', '08', 1500, 2000, 24, 5],
  [' Poker lata 473 ml', 'BEB', '08', 1500, 2000, 24, 5],
  [' Budweiser Lata 269 ml', 'BEB', '08', 1500, 2000, 24, 5],
  [' Kauffman Lata 310 ml', 'BEB', '08', 1500, 2000, 24, 5],
  [' Club Colombia 330 ml', 'BEB', '08', 1500, 2000, 24, 5],
  [' Corona 330 ml botella', 'BEB', '08', 1500, 2000, 24, 5],
  [' Corona Sixpack 330 ml', 'BEB', '08', 1500, 2000, 24, 5],
  [' Poker sixPack', 'BEB', '08', 1500, 2000, 24, 5],
  [' Poker latón Six Pack 473 ml', 'BEB', '08', 1500, 2000, 24, 5],
  [' Coronita 210 ml', 'BEB', '08', 1500, 2000, 24, 5],
  [' Coronita SixPack', 'BEB', '09', 1500, 2000, 24, 5],
  [' Pony 2 L', 'BEB', '09', 1500, 2000, 24, 5],
  [' pony 1.5 L', 'BEB', '09', 1500, 2000, 24, 5],
  [' Pony 1 L', 'BEB', '09', 1500, 2000, 24, 5],
  [' Kauffmann Six Pack 310 ml', 'BEB', '09', 1500, 2000, 24, 5],
  [' Pony personal 330 ml', 'BEB', '09', 1500, 2000, 24, 5],
  [' Pony mini 250 ml', 'BEB', '09', 1500, 2000, 24, 5],
  [' Electrolit 625 ml', 'BEB', '09', 1500, 2000, 24, 5],
  [' Cola y pola 269 ml', 'BEB', '09', 1500, 2000, 24, 5],
  [' Cola y pola 1.5 L', 'BEB', '09', 1500, 2000, 24, 5],
  [' Sporade 1.1 L', 'BEB', '06', 1500, 2000, 24, 5],
  [' Bing cola Sabores 400 ml', 'BEB', '06', 1500, 2000, 24, 5],
  [' Cifruit 400 ml', 'BEB', '06', 1500, 2000, 24, 5],
  [' Sporade 500 ml', 'BEB', '06', 1500, 2000, 24, 5],
  [' Cifruit sabores 1.7 L', 'BEB', '06', 1500, 2000, 24, 5],
  [' Cifruit 250 ml', 'BEB', '06', 1500, 2000, 24, 5],
  [' Agua Cielo 1 L', 'BEB', ' Del Es Sí Hola A A No Del El 06', 1500, 2000, 24, 5],
  [' Bigcola sabores 1 L', 'BEB', '06', 1500, 2000, 24, 5],
  [' Big Cola sabores 1.8 L', 'BEB', '06', 1500, 2000, 24, 5],
  [' Big Cola Sabores 3 L', 'BEB', '06', 1500, 2000, 24, 5],
  [' Agua cielo sabores 1 L', 'BEB', '06', 1500, 2000, 24, 5],
  [' Soda big cola 2100 ml', 'BEB', '06', 1500, 2000, 24, 5],
  [' Volt lata 473 ml', 'BEB', '06', 1500, 2000, 24, 5],
  [' Bolt botella 250 ml', 'BEB', '06', 1500, 2000, 24, 5],
  [' Agua Cielo 600 ml', 'BEB', '06', 1500, 2000, 24, 5],
  [' Cigarra 400 ml', 'BEB', '12', 1500, 2000, 24, 5],
  [' Cigarra 1.5 L', 'BEB', '12', 1500, 2000, 24, 5],
  [' Agua cigarra 6 L', 'BEB', '12', 1500, 2000, 24, 5],
  [' Agua mía 600 ml', 'BEB', '13', 1500, 2000, 24, 5],
  [' Agua mia 1 L', 'BEB', '13', 1500, 2000, 24, 5],
  [' Agua mía gas 600 ml', 'BEB', '13', 1500, 2000, 24, 5],
  [' Agua mía A gas 1 L', 'BEB', '13', 1500, 2000, 24, 5],
  [' Vive 100 380 ml', 'BEB', '35', 1500, 2000, 24, 5],
  [' Vive 100 240 ml', 'BEB', '35', 1500, 2000, 24, 5],
  [' Hidralite 640 ml', 'BEB', '35', 1500, 2000, 24, 5],
  [' Sabiloe de 3220 ml', 'BEB', '35', 1500, 2000, 24, 5],
  [' Cuates 269 ml', 'BEB', '35', 1500, 2000, 24, 5],
  [' Frutiño 10 gr', 'BEB', '35', 1500, 2000, 24, 5],
  [' Voca 10 gr', 'BEB', '35', 1500, 2000, 24, 5],
  [' Panelada caja de 29 unidades', 'BEB', '35', 1500, 2000, 24, 5],
  [' Gelatina Frutiño 14 Gr', 'BEB', '35', 1500, 2000, 24, 5],
  [' Gelatina sin sabor 15 gr', 'BEB', '35', 1500, 2000, 24, 5],
  [' Suntea 12 Gr', 'BEB', '35', 1500, 2000, 24, 5],
  [' Kipitos 8 Gr', 'BEB', '35', 1500, 2000, 24, 5],
  [' Amper 473 ml', 'BEB', '35', 1500, 2000, 24, 5],
  [' Ricostilla Completísimo doña gallina Polvo', 'BEB', '35', 1500, 2000, 24, 5],
  [' Cubo ricostilla', 'BEB', '35', 1500, 2000, 24, 5],
  [' Trizasón 20 Gr', 'BEB', '35', 1500, 2000, 24, 5],
  [' Cerveza Heineken Sixpack 310 ml', 'BEB', '5', 1500, 2000, 24, 5],
  [' Cerveza Heineken 310 ml', 'BEB', '5', 1500, 2000, 24, 5],
  [' Cerveza Tecate 473 ml', 'BEB', '5', 1500, 2000, 24, 5],
  [' Cerveza Tecate 330 ml', 'BEB', '5', 1500, 2000, 24, 5],
  [' Cerveza Andina 473 ml', 'BEB', '5', 1500, 2000, 24, 5],
  [' Yogurt victoria paquete x8', 'LAC', '9', 1500, 2000, 24, 5],
  [' Yogurt Google Victoria unidad 150 ml', 'LAC', '9', 1500, 2000, 24, 5],
  [' Kumis 150 ml', 'LAC', '9', 1500, 2000, 24, 5],
  [' Yogurt light 150 ml ', 'LAC', '9', 1500, 2000, 24, 5],
  [' Chocolatada Bilac 180 ml', 'LAC', '5', 1500, 2000, 24, 5],
  [' Avena Bilac', 'LAC', '5', 1500, 2000, 24, 5],
  [' Yogo premio 150 ml', 'LAC', '10', 1500, 2000, 24, 5],
  [' Yogo yogo bolsa', 'LAC', '10', 1500, 2000, 24, 5],
  [' Avena bolsa', 'LAC', '10', 1500, 2000, 24, 5],
  [' Arequipe 220 ml', 'LAC', '10', 1500, 2000, 24, 5],
  [' Arequipe 50 ml', 'LAC', '10', 1500, 2000, 24, 5],
  [' Queso esparcible 200 ml', 'LAC', '10', 1500, 2000, 24, 5],
  [' Queso parmesano 40 ml', 'LAC', '10', 1500, 2000, 24, 5],
  [' Leche alpín caja', 'LAC', '10', 1500, 2000, 24, 5],
  [' Avena vaso 250 ml', 'LAC', '10', 1500, 2000, 24, 5],
  [' Leche 1100 ml', 'LAC', '28', 1500, 2000, 24, 5],
  [' Leche 400 ml', 'LAC', '28', 1500, 2000, 24, 5],
  [' Leche 200 ml', 'LAC', '28', 1500, 2000, 24, 5],
  [' Leche deslactosada 1100 ml', 'LAC', '28', 1500, 2000, 24, 5],
  [' Leche 1100 ml', 'LAC', '27', 1500, 2000, 24, 5],
  [' Leche 400 ml', 'LAC', '270', 1500, 2000, 24, 5],
  [' Leche 200 ml', 'LAC', '27', 1500, 2000, 24, 5],
  [' Leche deslactosada 1100 ml', 'LAC', '27', 1500, 2000, 24, 5],
  [' Crema De leche 125 ml', 'LAC', '27', 1500, 2000, 24, 5],
  [' Crema De leche 170 ml', 'LAC', '27', 1500, 2000, 24, 5],

  //Dulces y Dulces
  ['Bicabonto Osa 25gr', 'SNA', '39', 497, 700, 24, 5],
  ['Bicabonto Osa 500gr', 'SNA', '39', 3629, 4500, 24, 5],
  ['Trocipollo 30gr', 'SNA', '39', 1380, 1600, 24, 5],
  ['Chao pastilla sabores x16', 'SNA', '39', 800, 1000, 24, 5],
  ['Barra bianchi mini', 'SNA', '39', 877, 1000, 24, 5],
  ['Rey Chapetta 55gr', 'SNA', '39', 1383, 1800, 24, 5],
  ['Riopaila azucar morena 1 Kg', 'SNA', '39', 3982, 4800, 24, 5],
  ['Jabon adulto surtidso', 'SNA', '39', 1500, 2000, 24, 5],
  ['Jojo Fruna Zombie surtido', 'SNA', '39', 2465, 500, 24, 5],
  ['Zucaritas', 'SNA', '39', 1110, 1500, 24, 5],
  ['Mantequilla Rama Tradicional 170gr', 'SNA', '39', 3792, 4800, 24, 5],
  ['Mermelada 80 gr sabores', 'SNA', '39', 1994, 2500, 24, 5],
  ['Barrilete surtido ', 'SNA', '39', 242, 400, 24, 5],
  ['Lokiño Surtido pack x100', 'SNA', '39-16', 7951, 9000, 24, 5],
  ['Lokiño Surtido unidad', 'SNA', '39', 79, 100, 24, 5],
  ['Trululu Surtido 35gr', 'SNA', '39-16', 1498, 2000, 24, 5],
  ['Trululu Lenguas Blex', 'SNA', '39', 1805, 2500, 24, 5],
  ['OKA Nano Grageada', 'SNA', '39', 1858, 2500, 24, 5],
  ['Tiktak fruit', 'SNA', '39', 2127, 2500, 24, 5],
  ['Oka Loka Fusion', 'SNA', '39', 935, 1200, 24, 5],
  ['Galleta Glasita Surtida', 'SNA', '39', 934, 1200, 24, 5],
  ['Tajin Clásico 45 gr', 'SNA', '39', 6887, 8000, 24, 5],
  ['Cereal Kellowgs 115gr', 'SNA', '39', 4725, 5500, 24, 5],
  ['Guantes Tallas varias', 'ASH', '39', 4607, 5500, 24, 5],
  ['Talco Yodora 60gr', 'SNA', '39', 4800, 6000, 24, 5],
  ['Sobres comida humeda 85gr', 'MAS', '39', 2400, 3000, 24, 5],

  //Puyo
  ['Guante Bicolor c25 tallas varias', 'ASH', '15', 4277, 5500, 24, 5],
  ['Copa blanca', 'VAR', '15', 1595, 2000, 24, 5],
  ['Vaso 7 Onzas colores', 'VAR', '15', 1801, 2500, 24, 5],
  ['Gragante Jabon Barra', 'ASP', '15', 1972, 2500, 24, 5],
  ['Tucol 10ml', 'MED', '15', 1550, 2000, 24, 5],
  ['BombonBum Sabores paquete', 'SNA', '15', 8696, 10000, 24, 5],
  ['BombonBum Sabores unidad', 'SNA', '15', 362, 500, 24, 5],
  ['Pirulito surtido paquete', 'SNA', '15', 3678, 4500, 24, 5],
  ['Pirulito surtido unidad', 'SNA', '15', 153, 200, 24, 5],
  ['Maxcombi surtido paquete', 'SNA', '15', 7305, 8500, 24, 5],
  ['Maxcombi surtido paquete', 'SNA', '15', 73, 100, 24, 5],
  ['Chocodisk sobre', 'SNA', '15', 883, 1200, 24, 5],
  ['Millows Mini', 'SNA', '15', 684, 1000, 24, 5],
  ['Chicle Xplode Acido Linea', 'SNA', '15', 466, 600, 24, 5],
  ['Aji Picante La constancia', 'VAR', '15', 3209, 3800, 24, 5],
  ['Vinagre 230ml', 'VAR', '15', 1452, 2000, 24, 5],
  ['Raid 285 ml', 'VAR', '15', 10698, 13000, 24, 5],
  ['Salsa Soya 100 ml', 'VAR', '15', 1768, 2200, 24, 5],
  ['Fruticas Acidas Sobre', 'SNA', '15', 929, 1200, 24, 5],
  ['Pirulito Neon Polvo acido 14 gr', 'SNA', '15', 609, 1000, 24, 5],
  ['Galleta Wafer Capri Paquete x24', 'SNA', '15', 6314, 8000, 24, 5],
  ['Galleta Wafer Capri Unidad', 'SNA', '15', 263, 400, 24, 5],
  ['Goma Trululu Nanos 100 gr', 'SNA', '16', 2343, 2700, 24, 5],
  ['Goma Trululu Nanos 70 gr', 'SNA', '16', 1735, 2200, 24, 5],
  ['Mermelada San Jorge 80 gr', 'VAR', '16', 1931, 2500, 24, 5],
  ['Pim Pop x24', 'SNA', '16', 7596, 8500, 24, 5],
  ['Pim Pop unidad x24', 'SNA', '16', 316, 500, 24, 5],
  ['Arroz FlorHuila arroba', 'GRA', '16', 42329, 47000, 24, 5],
  ['Arroz FlorHuila unidad 500 gr', 'GRA', '16', 1693, 2000, 24, 5],
  ['Dulce Tamarindo', 'SNA', '16', 8235, 9500, 24, 5],
  ['Revolcon x50', 'SNA', '16', 6838, 8000, 24, 5],
  ['Revolcon unidad', 'SNA', '16', 132, 200, 24, 5],
  ['Blanqueador Mi dia Pet 1800 ml', 'SNA', '16', 3182, 3800, 24, 5],
  ['Sopa Ajinomen 80gr', 'VAR', '16', 2460, 2900, 24, 5],
  ['Suero Pedialite 500 ml', 'BEB', '16', 8728, 10000, 24, 5],
  ['Loza Cream 3000 gr', 'ASH', '16', 14029, 16000, 24, 5],
  ['Ariel regular 100 gr', 'ASH', '16', 1260, 1500, 24, 5],
  ['Sanpic Vainilla 200ml', 'ASH', '16', 1600, 2000, 24, 5],
  ['Vanish Rosa 130 ml', 'ASH', '16', 2000, 2700, 24, 5],
  ['Blanqueador Blancox 500 ml', 'ASH', '16', 1457, 1800, 24, 5],
  ['Lavaloza Cream MI dia 1000 gr', 'SNA', '16', 4800, 5500, 24, 5],

  ['', 'LAC', '28', 1500, 2000, 24, 5],
  ['', 'LAC', '28', 1500, 2000, 24, 5],
  ['', 'LAC', '27', 1500, 2000, 24, 5],
  ['', 'LAC', '27', 1500, 2000, 24, 5],
  ['', 'LAC', '27', 1500, 2000, 24, 5],
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