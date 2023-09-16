const express = require('express');
const router = express.Router();

const { seedController } = require('../controllers/seedcontroller');

router.post('/', seedController);


module.exports = router;