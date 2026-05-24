require('dotenv').config();
const connectDB = require('./src/config/db');
const User = require('./src/models/User');

const seedCajero = async () => {
  try {
    await connectDB();
    
    const email = 'cajero@inmaculadastore.com';
    const password = 'c@J3R0$2026*';
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      console.log('El usuario cajero ya existe. Actualizando contraseña y rol...');
      user.passwordHash = password; // Will be hashed by pre-save hook
      user.role = 'cajero';
      await user.save();
      console.log('Usuario actualizado exitosamente.');
    } else {
      console.log('Creando usuario cajero...');
      user = new User({
        name: 'Cajero Principal',
        email: email,
        passwordHash: password, // Will be hashed by pre-save hook
        role: 'cajero',
        isActive: true
      });
      await user.save();
      console.log('Usuario cajero creado exitosamente.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedCajero();
