const User = require("../models/userModel");
const createError = require('http-errors');
const { successResponse, errorResponse } = require('../helpers/responseHandler');
const createHttpError = require("http-errors");
const { findItemById } = require("../services/findItem");
const fs = require('fs');


// Get all users with pagination and search
const getAllUsersController = async (req, res) => {
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
const getUserController = async (req, res) => {
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
        const imagePath = user.image;
        fs.access(imagePath, (error) => {
            if (error) {
                console.error('User Image does not exist');
            } else {
                fs.unlink(imagePath, (error) => {
                    if (error) {
                        throw error;
                    } else {
                        console.log('User Image removed successfully');
                    }
                });
            }
        });

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

module.exports = {
    getAllUsersController,
    getUserController,
    deleteUserController,
};