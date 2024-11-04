const mongoose = require('mongoose');

const portatilSchema = new mongoose.Schema(
  {
    imagen: { type: String },
    nombre: { type: String },
    precio: { type: String }
  },
  { timestamps: true, collection: 'portatiles' }
);

const Portatil = mongoose.model('portatiles', portatilSchema, 'portatiles');

module.exports = Portatil;
