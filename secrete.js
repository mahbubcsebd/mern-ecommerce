require('dotenv').config();

const port = process.env.PORT || 8000;
const mongoDBUrl =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommerceMernDB';
const defaultImagePath =
        process.env.DEFAULT_IMAGE_PATH || 'public/images/default.png';

const jwtRegKey =
    process.env.JWT_REG_KEY ||
    'GHJDKJDSHKJAHDKYHU*I$45454';

const smtpUserName = process.env.SMTP_USER_NAME || '';
const smtpPassword = process.env.SMTP_PASSWORD || '';
const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';

const jwtAccessKey =
    process.env.JWT_ACCESS_KEY ||
    'GHJDKJDSHKJAHDKYHU*I$45454';

module.exports = {
    port,
    mongoDBUrl,
    defaultImagePath,
    jwtRegKey,
    smtpUserName,
    smtpPassword,
    clientUrl,
    jwtAccessKey,
};