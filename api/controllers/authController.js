const createHttpError = require('http-errors');
const User = require('../models/userModel');
const { successResponse, errorResponse } = require('../helpers/responseHandler');
const bcrypt = require('bcryptjs');
const { createJsonWebToken } = require('../helpers/jsonWebToken');
const { jwtAccessKey } = require('../../secrete');


// Login Controller
const loginController = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Check if user exist
        const user = await User.findOne({ email });
        if (!user) throw createHttpError(400, 'User does not exist. Please sign up first');

        // Check if password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw createHttpError(401, 'Email or password does not match. Please try again');

        // Check if user is banned
        if (user.isBanned) throw createHttpError(400, 'You are banned. Please contact with admin');

        // Generate token
        const accessToken = createJsonWebToken({ user }, jwtAccessKey, '15m');

        // Set cookie
        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            maxAge: 15 * 60 * 1000, // 15 minutes
            secure: true,
            sameSite: 'none',
        });

        return successResponse(res, {
            statusCode: 200,
            message: "Login Successfully",
            payload: { },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status,
            message: error.message,
        });
    }
};

// Logout Controller
const logoutController = async (req, res, next) => {
    try {
        // Clear cookie
        res.clearCookie('accessToken');

        return successResponse(res, {
            statusCode: 200,
            message: 'Logout Successfully',
            payload: {},
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status,
            message: error.message,
        });
    }
};

module.exports = { loginController, logoutController };
