const {
  postPortatil,
  getPortatiles,
  insertAllPortatiles
} = require('../controllers/portatil');

const portatilRouter = require('express').Router();

portatilRouter.post('/', postPortatil);
portatilRouter.get('/', getPortatiles);
portatilRouter.post('/a', insertAllPortatiles);
module.exports = portatilRouter;
