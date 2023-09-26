const express = require('express');
const {
    getAllUsersController,
    getUserController,
    deleteUserController,
    registerUserController,
    activateUserController,
} = require('../controllers/userController');
const upload = require('../middlewares/uploadFile');
const { registerValidation } = require('../validators/auth');
const { runValidation } = require('../validators');
const router = express.Router();


// Register a user
router.post('/register', registerValidation, runValidation, upload.single("image"), registerUserController);
// Verify user account
router.post('/verify', activateUserController);
// Get all users
router.get('/', getAllUsersController);
// Get a single user by id
router.get('/:id', getUserController);




// Delete a user
router.delete('/:id', deleteUserController);


module.exports = router;