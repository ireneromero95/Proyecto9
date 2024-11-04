require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { connectDB } = require('./src/config/db');
const Portatil = require('./src/api/models/portatil');
const portatilRouter = require('./src/api/routes/portatil');

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/v1/portatiles', portatilRouter);
app.use('*', (req, res) => {
  return res.status(404).json('Route not found');
});

app.listen(3001, () => {
  console.log('Servidor abierto en http://localhost:3001');
});
