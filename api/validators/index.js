const { validationResult } = require('express-validator');

const runValidation = async (req, res, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // Return a 400 Bad Request response if there are validation errors
            return res.status(400).json({
                statusCode: 400,
                message: 'Validation error',
                payload: errors.array(),
            });
        }
        next();
    } catch (error) {
        // Check if the error is a validation error
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                message: error.message,
                payload: {},
            });
        }

        // Otherwise, return a 500 Internal Server Error response
        return res.status(500).json({
            statusCode: 500,
            message: 'Internal server error from runValidate',
            payload: {},
        });
    }
};

module.exports = {
    runValidation,
};
