const express = require('express');
const {
    getAllUsersController,
    getUserController,
    deleteUserController,
} = require('../controllers/userController');
const router = express.Router();



// Get all users
router.get('/', getAllUsersController);

// Get a user by id
router.get('/:id', getUserController);

// Create a user
router.post('/', (req, res) => {
    const { name, email, password, address, phone } = req.body;


});

// Update a user
router.put('/:id', (req, res) => {
    res.status(200).json({
        message: 'Update a user',
    });
});

// Delete a user
router.delete('/:id', deleteUserController);


module.exports = router;