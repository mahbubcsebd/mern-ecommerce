const User = require("../models/userModel");
const createError = require('http-errors');
const { successResponse, errorResponse } = require('../helpers/responseHandler');
const createHttpError = require("http-errors");
const { findItemById } = require("../services/findItem");
const deleteImage = require("../helpers/deleteImage");
const { createJsonWebToken } = require("../helpers/jsonWebToken");
const { jwtRegKey } = require("../../secrete");


// Get all users with pagination and search
const getAllUsersController = async (req, res, next) => {
    try {

        // For Search
        const search = req.query.search || '';

        // For Pagination
        const page = Number(req.query.page) || 1;
        // Number of items we want to show in each page
        const limit = Number(req.query.limit) || 5;



        // Regex for search (first and last value skip and case insensitive)
        const searchRegex = new RegExp('.*' + search + '.*', 'i');

        const filterUser = {
            isAdmin: { $ne: true },
            $or: [
                { name: { $regex: searchRegex }},
                { email: { $regex: searchRegex }},
                { phone: { $regex: searchRegex }},
            ],
        };



        // We don't want to show password
        const options = {
            password: 0,
        };


        // Get all users
        const users = await User.find(filterUser, options)
            .limit(limit)
            .skip((page - 1) * limit);

        // Get total number of users
        const count = await User.find(filterUser).countDocuments();

        //  If no user found
        if(!users) throw createError(404, 'Users not found');

        return successResponse(res, {
            statusCode: 200,
            message: 'Get all users successfully',
            payload: {
                users,
                pagination: {
                    currentPage: page,
                    previousPage: page > 1 ? page - 1 : null,
                    nextPage: page < Math.ceil(count / limit) ? page + 1 : null,
                    currentItems: users.length,
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                },
            },
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error from getAllUsersHandler',
        });
    }
};


// Get a user by id
const getUserController = async (req, res, next) => {
    try {
        const id = req.params.id;

        // We don't want to show password
        const options = {
            projection: { password: 0 },
        };

        const user = await findItemById(User, id, options);

        return successResponse(res, {
            statusCode: 200,
            message: 'Get a user by Id successfully',
            payload: { user },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status,
            message: error.message,
        });
    }
};


// Delete a user by id
const deleteUserController = async (req, res, next) => {
    try {
        const id = req.params.id;

        const options = {
            projection: { password: 0 },
        };

        // Fetch user details
        const user = await findItemById(User, id);

        // Check if the user exists
        if (!user) {
            return next(createHttpError(404, 'User not exist by this id'));
        }

        // Check if the user is an admin and prevent deletion if true
        if (user.isAdmin) {
            return next(createHttpError(403, 'Admin user cannot be deleted'));
        }

        // For delete user using image
        const userImagePath = user.image;
        deleteImage(userImagePath);



        // Delete a user except admin
        const deletedUser = await User.findByIdAndDelete(id, options);

        return successResponse(res, {
            statusCode: 200,
            message: 'User deleted successfully',
            payload: { deletedUser },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status,
            message: error.message,
        });
    }
};



// Register a user
const registerUserController = async (req, res, next) => {
    try {
        const { name, email, password, phone, address } = req.body;
        // Check if the user already exists
        const userExist = await User.exists({ email: email });
        if (userExist) {
            return next(
                createHttpError(409, 'User already exists. Please Sign In')
            );
        }

        // Create JWT token
        const token = createJsonWebToken(
            { name, email, password, phone, address },
            jwtRegKey,
            "10m"
        );



        // Create a new user
        const newUser = new User({
            name,
            email,
            password,
            phone,
            address,
            token,
        });

        return successResponse(res, {
            statusCode: 200,
            message: 'User created successfully',
            payload: { newUser, token },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status,
            message: error.message,
        });
    }
};

module.exports = {
    getAllUsersController,
    getUserController,
    deleteUserController,
    registerUserController,
};