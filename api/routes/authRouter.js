const express = require('express');
const { runValidation } = require('../validators');
const authRouter = express.Router();
const {
    loginController,
    logoutController,
} = require('../controllers/authController');
const { loginValidation } = require('../validators/authValidators');
const { isLoggedOut, isLoggedIn } = require('../middlewares/auth');



authRouter.post('/login', loginValidation, runValidation, isLoggedOut, loginController);
authRouter.post('/logout', isLoggedIn, logoutController);



module.exports = authRouter;
