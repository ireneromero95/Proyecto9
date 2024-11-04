const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log('Conectado a la BDD');
  } catch (error) {
    console.log('No se conecta la BDD');
  }
};

module.exports = { connectDB };
