const express = require('express');
const {
    getAllUsersController,
    getUserController,
    deleteUserController,
    registerUserController,
    activateUserController,
} = require('../controllers/userController');
const router = express.Router();


// Register a user
router.post('/register', registerUserController);
// Verify user account
router.post('/verify', activateUserController);
// Get all users
router.get('/', getAllUsersController);
// Get a single user by id
router.get('/:id', getUserController);




// Delete a user
router.delete('/:id', deleteUserController);


module.exports = router;