require('dotenv').config();

const port = process.env.PORT || 8000;
const mongoDBUrl =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommerceMernDB';
const defaultImagePath =
        process.env.DEFAULT_IMAGE_PATH || 'public/images/default.png';

module.exports = {
    port,
    mongoDBUrl,
    defaultImagePath,
};