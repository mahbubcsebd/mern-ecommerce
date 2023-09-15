const mongoose = require('mongoose');
const { mongoDBUrl } = require('../../secrete');


const connectToDatabase = async (options = {}) => {
    try {
        await mongoose.connect(mongoDBUrl, options);
        console.log('Database connected successfully');


        mongoose.connection.on('error', (error) => {
            console.error(`Database connection error: ${error.message}`);
        });
    } catch (error) {
        console.error('Could not connect database:', error.toString());
    }
};

module.exports = connectToDatabase;