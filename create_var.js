const mongoose = require('mongoose');
require('dotenv').config({ path: 'c:/Users/USUARIO/Desktop/6. La Inmaculada/libkn/.env' });
const Category = require('./src/models/Category');

async function run() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Conectado a MongoDB');

    const existing = await Category.findOne({ code: 'VAR' });
    if (!existing) {
      await Category.create({ name: 'Varios', code: 'VAR', description: 'Categoría para productos varios sin clasificar', icon: '🛒' });
      console.log('Category VAR created successfully.');
    } else {
      console.log('Category VAR already exists.');
    }
  } catch (error) {
    console.error(error);
  } finally {
    await mongoose.disconnect();
    console.log('Desconectado de MongoDB');
  }
}

run();
