const express = require('express');
const {
    getAllUsersController,
    getUserController,
    deleteUserController,
    registerUserController,
} = require('../controllers/userController');
const router = express.Router();



// Get all users
router.get('/', getAllUsersController);
// Get a user by id
router.get('/:id', getUserController);
// Register a user
router.post('/register', registerUserController);



// Delete a user
router.delete('/:id', deleteUserController);


module.exports = router;