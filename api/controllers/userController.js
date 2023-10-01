const User = require("../models/userModel");
const createError = require('http-errors');
const { successResponse, errorResponse } = require('../helpers/responseHandler');
const createHttpError = require("http-errors");
const { findItemById } = require("../services/findItem");
const deleteImage = require("../helpers/deleteImage");
const { createJsonWebToken } = require("../helpers/jsonWebToken");
const { jwtRegKey, smtpUserName, clientUrl } = require("../../secrete");
const sendEmail = require("../helpers/email");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');


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
        const user = await findItemById(User, id, options);

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


// Update a user by id
const updateUserController = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const updateOptions = {
            new: true,
            runValidators: true,
            context: 'query',
        };

        let updates = {};


        for (let key in req.body) {
            if (['name', 'password', 'phone', 'address'].includes(key)) {
                updates[key] = req.body[key];
            }

            else if (['email'].includes(key)) {
                throw createHttpError(400, 'Email cannot be updated');
            }
        }

        if (req.file) {
            const userImage = req.file;
            const imageBufferString = userImage.buffer.toString('base64');

            if (!userImage) {
                return next(createHttpError(400, 'Image is required'));
            }

            if (userImage.size > 1024 * 1024 * 2) {
                return next(
                    createHttpError(400, 'Image should be less than 2MB')
                );
            } // 2MB

            updates.image = imageBufferString;
        }

        // Check if the user exists
        const user = await findItemById(User, userId, updateOptions);

        if (!user) {
            return next(createHttpError(404, 'User not exist by this id'));
        }


        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select('-password');

        if(!updatedUser) throw createError(404, 'User not found');

        return successResponse(res, {
            statusCode: 200,
            message: 'User updated successfully',
            payload: { updatedUser },
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

        const userImage = req.file;
        const imageBufferString = userImage.buffer.toString('base64');

        // if (!userImage) {
        //     return next(createHttpError(400, 'Image is required'));
        // }

        if(userImage.size > 1024 * 1024 * 2) {
            return next(createHttpError(400, 'Image should be less than 2MB'));
        } // 2MB

        // Check if the user already exists
        const userExist = await User.exists({ email: email });
        if (userExist) {
            return next(
                createHttpError(409, 'User already exists. Please Sign In')
            );
        }

        // Create JWT token
        const token = createJsonWebToken(
            { name, email, password, phone, address, imageBufferString },
            jwtRegKey,
            "10m"
        );

        // Prepare Email
        const emailData = {
            from: smtpUserName,
            to: email,
            subject: 'Account Activation Email',
            html: `
                <h2>Hello ${name} !</h2>
                <p>Please <a href="${clientUrl}/api/users/activate/${token} target="_blank">click here</a> to activate your account</p>
            `,
        };


        // Send Email with Node mailer
        try {
            await sendEmail(emailData);
        } catch (error) {
            throw createHttpError(500, 'Email sent failed');
        }

        return successResponse(res, {
            statusCode: 200,
            message: `Please check your email:${email} to activate your account`,
            payload: { token },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status,
            message: error.message,
        });
    }
};


// Activate a user
const activateUserController = async (req, res, next) => {
    try {
        const token = req.body.token;

        // Check if the token is valid
        if (!token) {
            return next(createHttpError(400, 'Token not found'));
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, jwtRegKey);

            if (!decoded) {
                return next(
                    createHttpError(400, 'User was not able to register')
                );
            };

            // Check if the user already exists
            const userExist = await User.exists({ email: decoded.payload.email });
            if (userExist) {
                return next(
                    createHttpError(409, 'User already exists. Please Sign In')
                );
            };

            await User.create(decoded.payload);


        return successResponse(res, {
            statusCode: 201,
            message: `User registered successfully`,
            payload: {},
        });

        } catch (error) {
            if (error.name === 'TokenExpiredError') {
                return next(createHttpError(400, 'Token expired'));
            } else if (error.name === 'JsonWebTokenError') {
                return next(createHttpError(400, 'Invalid Token'));
            } else {
                return next(createHttpError(500, 'Internal server error'));
            }
        }
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status,
            message: error.message,
        });
    }
};

// Ban a user
const banUserController = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const options = {new: true};

        // Check if the user exists
        const user = await findItemById(User, userId, options);


        const updates = {
            isBanned: true,
        };

        updateOptions = {
            new: true,
            runValidators: true,
            context: 'query',
        };

        const bannedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select('-password');


        return successResponse(res, {
            statusCode: 200,
            message: 'user banned successfully',
            payload: { bannedUser },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status,
            message: error.message,
        });
    }
};


// Ban a user
const unBanUserController = async (req, res, next) => {
    try {
        const userId = req.params.id;

        const options = {new: true};

        // Check if the user exists
        const user = await findItemById(User, userId, options);


        const updates = {
            isBanned: false,
        };

        updateOptions = {
            new: true,
            runValidators: true,
            context: 'query',
        };


        const bannedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            updateOptions
        ).select('-password');


        return successResponse(res, {
            statusCode: 200,
            message: 'user unbanned successfully',
            payload: { bannedUser },
        });
    } catch (error) {
        return errorResponse(res, {
            statusCode: error.status,
            message: error.message,
        });
    }
};


// Update Password
const updatePasswordController = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const { oldPassword, newPassword, confirmPassword } = req.body;

        const options = {
            projection: { password: 0 },
        };

        // Check if the user exists
        const user = await findItemById(User, userId, options);

        // Check if password is correct
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch)
            throw createHttpError(
                401,
                'Old Password does not match. Please try again'
            );

        // Check if new password and confirm password are same
        if (newPassword !== confirmPassword){
            throw createHttpError(401, 'Confirm Password does not match');
        }

        if (oldPassword === newPassword){
            throw createHttpError(401, 'Old Password and New Password cannot be same');
        }

        const filter = { _id: userId };
        const updates = { password: newPassword };
        const updateOptions = { new: true };

        const updatedUser = await User.findOneAndUpdate(
            filter,
            updates,
            updateOptions
        ).select('-password');





        return successResponse(res, {
            statusCode: 200,
            message: 'password update successfully',
            payload: { updatedUser },
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
    activateUserController,
    updateUserController,
    banUserController,
    unBanUserController,
    updatePasswordController,
};