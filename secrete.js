require('dotenv').config();

const port = process.env.PORT || 8000;
const mongoDBUrl =
    process.env.MONGODB_URL || 'mongodb://localhost:27017/ecommerceMernDB';
const defaultImagePath =
        process.env.DEFAULT_IMAGE_PATH || 'public/images/default.png';

const jwtRegKey = process.env.JWT_REG_KEY || "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5NDg2NTc5OCwiaWF0IjoxNjk0ODY1Nzk4fQ.TyYdfbZSOAB6BhJ1TMoO7nPnzBZwY_Ah-RxVPoKq-iw"

module.exports = {
    port,
    mongoDBUrl,
    defaultImagePath,
    jwtRegKey,
};