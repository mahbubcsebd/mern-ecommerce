require('dotenv').config();
const multer = require('multer');
const { uploadDirectory } = require('../../secrete');
const path = require('path');
const createHttpError = require('http-errors');
const { userImageDirectory, maxFileSize, allowedFileType } = require('../config');

const storage = multer.memoryStorage({
    // Set the destination for files
    destination: function (req, file, cb) {
        cb(null, userImageDirectory);
    },
    // Set the filename for files
    filename: function (req, file, cb) {
        const extname = path.extname(file.originalname);
        cb(
            null,
            Date.now() +
                '-' +
                file.originalname
                    .replace(extname, '')
                    .toLowerCase()
                    .split(' ')
                    .join('-') +
                extname
        );
    },
});

const fileFilter = (req, file, cb) => {
    const extname = path.extname(file.originalname);
    if (!allowedFileType.includes(file.mimetype)) {
        return cb(new Error('Only images are allowed'), false);
    }


    // if no error
    cb(null, true);
};

const upload = multer({
    storage: storage,
    limits: { fileSize: maxFileSize },
    fileFilter: fileFilter,
     });

module.exports = upload;
