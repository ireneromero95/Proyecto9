const Portatil = require('../models/portatil');

const postPortatil = async (req, res) => {
  try {
    const newPortatil = new Portatil(req.body);
    const portatilSaved = await newPortatil.save();
    return res.status(201).json({
      message: 'Portatil creado correctamente',
      portatil: portatilSaved
    });
  } catch (error) {
    return res.status(400).json('No se creó el portátil correctamente');
  }
};

const getPortatiles = async (req, res) => {
  try {
    const portatiles = await Portatil.find();
    return res.status(201).json(portatiles);
  } catch (error) {
    return res.status(400).json('No se creó el portátil correctamente');
  }
};

const insertAllPortatiles = async (req, res, next) => {
  try {
    await Portatil.insertMany(require('./portatiles.json'));
    return res.status(201).json('Portatiles inserted');
  } catch (error) {
    return next('Error inserting portatiles in DB', error);
  }
};
module.exports = { postPortatil, getPortatiles, insertAllPortatiles };
