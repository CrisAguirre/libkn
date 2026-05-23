const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/USUARIO/Desktop/6. La Inmaculada/libkn/.env' });
const Category = require('./src/models/Category');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');
    
    // Find and delete the categories matching the names (case insensitive)
    const result = await Category.deleteMany({
      name: { $in: [/^Otros$/i, /^Recargas$/i] }
    });
    
    console.log(`Borradas ${result.deletedCount} categorías.`);
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

run();
