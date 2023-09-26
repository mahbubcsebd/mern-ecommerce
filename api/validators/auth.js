const { body } = require('express-validator');

// Registration validation
const registerValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3, max: 32 })
        .withMessage('Name must be between 3 and 32 characters'),
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
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'),
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
    body('image').optional().isString(),
];

// Sign In validation
const signInValidation = [
    // Define validation rules for sign in here
    body('email')
        .trim()
        .notEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Enter your user email'),
    body('password')
        .trim()
        .notEmpty()
        .withMessage('Enter your password')
];

// Forgot Password validation
const forgotPasswordValidation = [
    // Define validation rules for forgot password here

];

// Reset Password validation
const resetPasswordValidation = [
    // Define validation rules for reset password here
];

// Update Password validation
const updatePasswordValidation = [
    // Define validation rules for updating password here
];

module.exports = {
    registerValidation,
    signInValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    updatePasswordValidation,
};
