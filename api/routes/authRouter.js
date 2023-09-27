const express = require('express');
const { runValidation } = require('../validators');
const authRouter = express.Router();
const {
    loginController,
    logoutController,
} = require('../controllers/authController');



authRouter.post('/login', loginController);
authRouter.post('/logout', logoutController);



module.exports = authRouter;
