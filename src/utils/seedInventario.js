/**
 * SEED DE INVENTARIO FICTICIO — DEMOSTORE
 * Ejecutar: node src/utils/seedInventario.js
 * 
 * Para inventario real: editar los arrays de productos con
 * los datos de tu toma física, luego ejecutar.
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Product  = require('../models/Product');
const Category = require('../models/Category');
const Supplier = require('../models/Supplier');


// ─── Datos de categorías con códigos ───────────────────────────
const CATEGORIAS = [
  { name: 'Bebidas',           icon: '🥤', code: 'BEB', order: 1 },
  { name: 'Lácteos',           icon: '🥛', code: 'LAC', order: 2 },
  { name: 'Snacks',            icon: '🍿', code: 'SNA', order: 3 },
  { name: 'Granos y Cereales', icon: '🌾', code: 'GRA', order: 4 },
  { name: 'Aseo Personal',     icon: '🧴', code: 'ASP', order: 5 },
  { name: 'Aseo Hogar',        icon: '🧹', code: 'ASH', order: 6 },
  { name: 'Enlatados',         icon: '🥫', code: 'ENL', order: 7 },
  { name: 'Carnes y Embutidos',icon: '🥩', code: 'CAR', order: 8 },
  { name: 'Frutas y Verduras', icon: '🥬', code: 'FRV', order: 9 },
  { name: 'Panadería',         icon: '🍞', code: 'PAN', order: 10 },
  { name: 'Mascotas',          icon: '🐶', code: 'MAS', order: 11 },
  { name: 'Medicamentos',      icon: '💊', code: 'MED', order: 12 },
  { name: 'Otros',             icon: '📦', code: 'OTR', order: 13 },
];

// ─── Datos de proveedores con códigos únicos (2 números) ────────
const PROVEEDORES = [
  { name: 'Coca-Cola FEMSA',     code: '01' },
  { name: 'PepsiCo',             code: '02' },
  { name: 'Postobón',            code: '03' },
  { name: 'Alquería',            code: '04' },
  { name: 'Van Camps',           code: '05' }, // Ejemplo del usuario
  { name: 'Alpina',              code: '06' },
  { name: 'Nestlé',              code: '07' },
  { name: 'Colgate-Palmolive',   code: '08' },
  { name: 'P&G',                 code: '09' },
  { name: 'Unilever',            code: '10' },
  { name: 'Nutresa',             code: '11' },
  { name: 'Diana Corp',          code: '12' },
  { name: 'Bimbo',               code: '13' },
  { name: 'Johnson & Johnson',   code: '14' },
  { name: 'Familia',             code: '15' },
  { name: 'Otras Marcas',        code: '99' },
];


// ─── Productos ficticios por categoría ─────────────────────────
// Formato: [nombre, proveedorNombre, precioCompra, precioVenta, stock, minStock]
const PRODUCTOS_POR_CATEGORIA = {
  'Bebidas': [
    ['Coca Cola 350ml',       'Coca-Cola FEMSA', 1500, 2000,  48, 12],
    ['Pepsi 400ml',           'PepsiCo',         1400, 1900,  36, 12],
    ['Agua Cristal 600ml',    'Postobón',         800, 1200,  60, 20],
    ['Jugo Hit Naranja 250ml','Postobón',         900, 1400,  30, 10],
    ['Gatorade Azul 500ml',   'PepsiCo',         2200, 3000,  24,  8],
    ['Pony Malta 300ml',      'Postobón',        1200, 1700,  40, 12],
    ['Agua Brisa 500ml',      'Coca-Cola FEMSA',  700, 1100,  72, 24],
    ['Colombiana 400ml',      'Postobón',        1400, 1900,  30, 10],
  ],
  'Lácteos': [
    ['Leche Alquería 1L',     'Alquería',        3200, 4200,  24,  8],
    ['Yogurt Alpina 200g',    'Alpina',          1800, 2500,  18,  6],
    ['Kumis Alquería 200ml',  'Alquería',        1700, 2400,  15,  5],
    ['Queso Doblecrema 250g', 'Alpina',          5500, 7500,  12,  4],
    ['Mantequilla Rama 125g', 'Unilever',        4200, 5800,   8,  3],
    ['Leche en Polvo 400g',   'Nestlé',          8500,11000,   6,  2],
  ],
  'Snacks': [
    ['Papas Margarita 100g',  'PepsiCo',         1800, 2500,  36, 12],
    ['Doritos Queso 70g',     'PepsiCo',         1700, 2400,  30, 10],
    ['Maní Salado 100g',      'Nutresa',          900, 1400,  24,  8],
    ['Chitos 60g',            'PepsiCo',          800, 1300,  40, 12],
    ['Chocolatina Jet',       'Nutresa',          700, 1200,  60, 20],
    ['Galletas Oreo 6u',      'Nutresa',         1500, 2200,  30, 10],
    ['Gomas Trolli 45g',      'Nutresa',          600, 1000,  48, 15],
  ],
  'Granos y Cereales': [
    ['Arroz Supremo 500g',    'Otras Marcas',    2200, 3000,  30, 10],
    ['Lentejas Diana 500g',   'Diana Corp',      2400, 3200,  20,  8],
    ['Frijoles Diana 500g',   'Diana Corp',      2600, 3500,  18,  6],
    ['Avena Quaker 200g',     'PepsiCo',         3500, 4800,  15,  5],
    ['Pasta Doria Espagueti', 'Nutresa',         1800, 2600,  24,  8],
    ['Harina de Trigo 1kg',   'Diana Corp',      3200, 4500,  12,  4],
  ],
  'Aseo Personal': [
    ['Shampoo H&S 375ml',     'P&G',             9500,13000,  10,  3],
    ['Jabón Dove 100g',       'Unilever',        3500, 5000,  24,  8],
    ['Crema Dental Colgate',  'Colgate-Palmolive', 4200, 6000,  18,  6],
    ['Desodorante Axe 150ml', 'Unilever',        8000,11000,   8,  3],
    ['Papel Higiénico x4',    'Familia',         5500, 7500,  16,  4],
    ['Pañuelos Familia x50',  'Familia',         3000, 4500,  12,  4],
  ],
  'Aseo Hogar': [
    ['Jabón Rey 300g',        'Otras Marcas',    2800, 4000,  18,  6],
    ['Ajax Limpiador 500ml',  'Colgate-Palmolive', 4500, 6500,  12,  4],
    ['Esponjilla 3M',         'Otras Marcas',    1200, 2000,  24,  8],
    ['Bolsas Basura x10',     'Otras Marcas',    3200, 4800,  15,  5],
    ['Suavizante Downy 500ml','P&G',             6500, 9000,   8,  3],
  ],
  'Enlatados': [
    ['Atún Van Camps 170g',   'Van Camps',       3200, 4500,  24,  8],
    ['Maíz Dulce Del Monte',  'Otras Marcas',    3800, 5200,  18,  6],
    ['Tomate Naturas 400g',   'Unilever',        2600, 3800,  20,  8],
    ['Sardinas Colfarina',    'Otras Marcas',    2800, 4000,  15,  5],
  ],
  'Carnes y Embutidos': [
    ['Salchicha Zenú 500g',   'Nutresa',         9000,13000,   8,  3],
    ['Jamón Zenú 200g',       'Nutresa',         6500, 9000,   6,  2],
    ['Mortadela Olimpica 200g','Nutresa',         5500, 8000,   8,  3],
  ],
  'Frutas y Verduras': [
    ['Tomate x500g',          'Otras Marcas',    1500, 2500,  10,  4],
    ['Cebolla Cabezona x500g','Otras Marcas',    1200, 2000,   8,  3],
    ['Papa Pastusa x1kg',     'Otras Marcas',    1800, 2800,  12,  4],
    ['Zanahoria x500g',       'Otras Marcas',    1300, 2100,   8,  3],
  ],
  'Panadería': [
    ['Pan Tajado Bimbo 450g', 'Bimbo',           5500, 7500,   8,  3],
    ['Mogolla x6',            'Otras Marcas',    2500, 3800,   6,  2],
    ['Croissant x2',          'Otras Marcas',    3000, 4500,   4,  2],
  ],
  'Mascotas': [],
  'Medicamentos': [],
  'Otros': [
    ['Encendedor Desechable', 'Otras Marcas',    1200, 2000,  24,  8],
    ['Pilas AA Duracell x2',  'Otras Marcas',    4500, 6500,  12,  4],
    ['Cinta Adhesiva 12mm',   'Otras Marcas',    1800, 3000,  10,  4],
  ],
};


async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Conectado a MongoDB');
    await Product.deleteMany({});
    console.log('🧹 Limpiando productos anteriores...');

    // Asegurar categorías con códigos
    console.log('📂 Verificando categorías...');
    const catMap = {};
    for (const catData of CATEGORIAS) {
      let cat = await Category.findOne({ name: catData.name });
      if (!cat) {
        cat = await Category.create(catData);
        console.log(`   + Categoría creada: ${catData.icon} ${catData.name}`);
      } else if (!cat.code) {
        cat.code = catData.code;
        await cat.save();
        console.log(`   ~ Código asignado: ${catData.code} → ${catData.name}`);
      }
      catMap[catData.name] = cat._id;
    }

    // Asegurar proveedores con códigos
    console.log('🚚 Verificando proveedores...');
    const provMap = {};
    for (const provData of PROVEEDORES) {
      let prov = await Supplier.findOne({ code: provData.code });
      if (!prov) {
        prov = await Supplier.create(provData);
        console.log(`   + Proveedor creado: [${provData.code}] ${provData.name}`);
      }
      provMap[provData.name] = { id: prov._id, code: prov.code };
    }

    // Crear productos
    console.log('\n📦 Creando productos ficticios...');
    let totalCreados = 0;
    const categoriaCodigos = {};
    CATEGORIAS.forEach(c => categoriaCodigos[c.name] = c.code);

    for (const [catName, prods] of Object.entries(PRODUCTOS_POR_CATEGORIA)) {
      const catId = catMap[catName];
      const catCode = categoriaCodigos[catName];
      if (!catId) { console.log(`   ⚠️  Categoría no encontrada: ${catName}`); continue; }
      
      let consecutive = 1;
      for (const [name, provName, purchasePrice, salePrice, stock, minStock] of prods) {
        const prov = provMap[provName] || provMap['Otras Marcas'];
        
        // Generar barcode: CAT(3) + PROV(2) + CONSEC(3)
        // Ejemplo: ENL + 05 + 001 = ENL05001
        const barcode = `${catCode}${prov.code}${consecutive.toString().padStart(3, '0')}`;
        
        await Product.create({ 
          name, 
          barcode, 
          category: catId, 
          supplier: prov.id,
          purchasePrice, 
          salePrice, 
          stock, 
          minStock 
        });
        
        consecutive++;
        totalCreados++;
      }
      console.log(`   ✓ ${catName}: ${prods.length} productos`);
    }

    const total = await Product.countDocuments();
    const sinStock = await Product.countDocuments({ stock: 0 });
    const stockBajo = await Product.countDocuments({ $expr: { $lte: ['$stock', '$minStock'] } });
    const valorCosto = await Product.aggregate([{ $group: { _id: null, v: { $sum: { $multiply: ['$stock','$purchasePrice'] } } } }]);
    const valorVenta = await Product.aggregate([{ $group: { _id: null, v: { $sum: { $multiply: ['$stock','$salePrice'] } } } }]);

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
