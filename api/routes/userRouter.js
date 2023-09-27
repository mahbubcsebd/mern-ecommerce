const express = require('express');
const {
    getAllUsersController,
    getUserController,
    deleteUserController,
    registerUserController,
    activateUserController,
    updateUserController,
} = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { registerValidation } = require('../validators/auth');
const { runValidation } = require('../validators');
const userRouter = express.Router();


// Register a user
userRouter.post(
    '/register',
    upload.single('image'),
    registerValidation,
    runValidation,
    registerUserController
);
// Verify user account
userRouter.post('/verify', activateUserController);
// Get all users
userRouter.get('/', getAllUsersController);
// Get a single user by id
userRouter.get('/:id', getUserController);
// Update a user
userRouter.put('/:id', upload.single('image'), updateUserController);




// Delete a user
userRouter.delete('/:id', deleteUserController);


module.exports = userRouter;