const express = require('express');
const {
    getAllUsersController,
    getUserController,
    deleteUserController,
    registerUserController,
    activateUserController,
    updateUserController,
    banUserController,
    unBanUserController,
    updatePasswordController,
} = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { registerValidation, updatePasswordValidation } = require('../validators/authValidators');
const { runValidation } = require('../validators');
const { isLoggedIn, isLoggedOut, isAdmin } = require('../middlewares/auth');
const userRouter = express.Router();


// Register a user
userRouter.post(
    '/register',
    upload.single('image'),
    isLoggedOut,
    registerValidation,
    runValidation,
    registerUserController
);
// Verify user account
userRouter.post('/verify', isLoggedOut, activateUserController);
// Get all users
userRouter.get('/', isLoggedIn, isAdmin, getAllUsersController);
// Get a single user by id
userRouter.get('/:id', isLoggedIn, isAdmin, getUserController);
// Update a user
userRouter.put('/:id', upload.single('image'), isLoggedIn, updateUserController);
// Ban a user
userRouter.put('/ban/:id', isLoggedIn, isAdmin, banUserController);
// Ban a user
userRouter.put('/unban/:id', isLoggedIn, isAdmin, unBanUserController);
// Update Password
userRouter.put('/update-password/:id', isLoggedIn, updatePasswordValidation, updatePasswordController);




// Delete a user
userRouter.delete('/:id', isLoggedIn, deleteUserController);


module.exports = userRouter;