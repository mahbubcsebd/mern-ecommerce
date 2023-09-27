const createHttpError = require('http-errors');
const jwt = require('jsonwebtoken');
const { jwtAccessKey } = require('../../secrete');

const isLoggedIn = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (!accessToken) throw createHttpError(401, 'You are not logged in');

        const decoded = jwt.verify(accessToken, jwtAccessKey);
        if(!decoded) throw createHttpError(401, 'You are not logged in');

        req.user = decoded.payload.user;
        next();
    } catch (error) {
        next(error);
    }
};


const isLoggedOut = (req, res, next) => {
    try {
        const accessToken = req.cookies.accessToken;
        if (accessToken) throw createHttpError(401, 'You are already logged in');

        next();
    } catch (error) {
        next(error);
    }
};


const isAdmin = (req, res, next) => {
    try {
        if (!req.user.isAdmin){
            throw createHttpError(403, 'You are not authorized');
        }

        console.log(req.user.isAdmin);


        next();
    } catch (error) {
        next(error);
    }
};


module.exports = {
    isLoggedIn,
    isLoggedOut,
    isAdmin,
};