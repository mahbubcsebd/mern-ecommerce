const express = require('express');
const { getAllUsersHandler } = require('../controllers/users.controller');
const router = express.Router();



// Get all users
router.get('/', getAllUsersHandler);

// Get a user by id
router.get('/:id', (req, res) => {
    res.status(200).json({
        message: 'Get a user by id',
    });
});

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
router.delete('/:id', (req, res) => {
    res.status(200).json({
        message: 'Delete a user',
    });
});


module.exports = router;