const express = require('express');
const seedRouter = express.Router();

const { seedController } = require('../controllers/seedcontroller');

seedRouter.post('/', seedController);


module.exports = seedRouter;