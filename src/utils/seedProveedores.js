/**
 * SEED DE PROVEEDORES — LA INMACULADA
 * Ejecutar: node src/utils/seedProveedores.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const Supplier = require('../models/Supplier');

const PROVEEDORES = [
  {
    name: 'Distribuidora Central S.A.',
    contactName: 'Carlos Pérez',
    phone: '3101234567',
    email: 'contacto@districentral.com',
    nit: '900.123.456-1',
    address: 'Calle 10 # 5-20, Bogotá',
    notes: 'Proveedor principal de bebidas y snacks.'
  },
  {
    name: 'Lácteos El Campo',
    contactName: 'María Rodríguez',
    phone: '3209876543',
    email: 'ventas@lacteoscampo.co',
    nit: '800.555.666-2',
    address: 'Carrera 45 # 12-30, Medellín',
    notes: 'Entregas los lunes y jueves.'
  },
  {
    name: 'Aseo y Hogar Express',
    contactName: 'Juan Martínez',
    phone: '3155554433',
    email: 'info@aseoexpress.com',
    nit: '900.333.222-0',
    address: 'Avenida 1 de Mayo # 15-40, Cali',
    notes: 'Precios competitivos en productos de limpieza.'
  }
];

async function seed() {
  try {
    // Intentar conectar con la URI del .env
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI no definida en el archivo .env');
    }

    await mongoose.connect(process.env.MONGODB_URI);
    console.log('\n✅ Conectado a MongoDB');
    
    console.log('🧹 Limpiando proveedores anteriores...');
    await Supplier.deleteMany({});

    console.log('📦 Creando proveedores de ejemplo...');
    const result = await Supplier.create(PROVEEDORES);
    
    console.log(`\n🚀 Seed de proveedores completado: ${result.length} proveedores cargados\n`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seed();
