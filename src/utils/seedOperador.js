require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/inmaculada';

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Conectado a MongoDB:', MONGO_URI);

    const email = 'jhostinmeza86@gmail.com';
    let user = await User.findOne({ email });

    if (user) {
      console.log('El usuario ya existe. Actualizando...');
      user.name = 'Jhostin Meza';
      user.passwordHash = 'Jhosbur87'; // Will be hashed by pre-save hook
      user.role = 'operador';
      await user.save();
      console.log('Usuario actualizado correctamente.');
    } else {
      user = new User({
        name: 'Jhostin Meza',
        email,
        passwordHash: 'Jhosbur87',
        role: 'operador'
      });
      await user.save();
      console.log('Usuario creado correctamente.');
    }

    mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Error seeding user:', err);
    process.exit(1);
  }
}

seed();
