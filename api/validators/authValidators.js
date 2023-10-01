const { body } = require('express-validator');

// Registration validation
const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 31 })
        .withMessage('Name should be at least 3-31 characters long'),
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        ),
    body('address')
        .trim()
        .notEmpty()
        .withMessage('Address is required')
        .isLength({ min: 3 })
        .withMessage('Address must be at least 3 characters long'),
    body('phone')
        .trim()
        .notEmpty()
        .withMessage('Phone is required')
        .isMobilePhone()
        .withMessage('Phone must be valid'),
    // body('image')
    //     .custom((value, { req }) => {
    //         if (!req.file) {
    //             throw new Error('Image is required');
    //         }
    //         return true;
    //     })
    //     .withMessage('Image is required'),
];

const loginValidation = [
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email must be valid'),

    body('password')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        ),
];

const updatePasswordValidation = [
    body('oldPassword')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        ),
    body('newPassword')
        .trim()
        .notEmpty()
        .withMessage('Password is required')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/)
        .withMessage(
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
        ),
    body('confirmPassword').custom((value, { req }) => {
        if (value !== req.body.newPassword) {
            throw new Error('Confirm password does not match');
        }
        return true;
    }
];

module.exports = {
    registerValidation,
    loginValidation,
    updatePasswordValidation,
};
