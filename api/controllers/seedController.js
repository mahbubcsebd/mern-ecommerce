const data = require('../../data');
const User = require("../models/userModel")

const seedController = async (req, res) => {
    // Delete existing all users
    try {
        await User.deleteMany({});

        // Create new users
        const users = await User.insertMany(data.users);

        res.status(200).json({
            message: 'Users are seeded',
            users,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Internal server error from seedController',
        });
    }
};


module.exports = {seedController};