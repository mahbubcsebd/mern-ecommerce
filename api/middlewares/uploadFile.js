require('dotenv').config();
const multer = require('multer');
const { uploadDirectory } = require('../../secrete');
const path = require('path');
const createHttpError = require('http-errors');
const { userImageDirectory, maxFileSize, allowedFileType } = require('../config');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    if(!allowedFileType.includes(file.mimetype)) {
        return cb(createHttpError(400, 'File type not allowed'), false);
    }

    if(file.size > maxFileSize) {
        return cb(createHttpError(400, 'File size too large'), false);
    }

    if(!allowedFileType.includes(file.mimetype)) {
        return cb(createHttpError(400, 'File extension not allowed'), false);
    }

    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
     });

module.exports = upload;
