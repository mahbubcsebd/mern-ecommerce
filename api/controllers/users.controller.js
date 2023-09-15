const getAllUsersHandler = (req, res) => {
    res.status(200).json({
        message: 'Get all users',
    });
};

module.exports = {  getAllUsersHandler }