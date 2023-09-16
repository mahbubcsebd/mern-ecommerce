const User = require("../models/userModel");
const createError = require('http-errors');
const { successResponse } = require('../helpers/responseHandler');

const getAllUsersHandler = async (req, res) => {
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
            message: 'All users',
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

module.exports = {  getAllUsersHandler }