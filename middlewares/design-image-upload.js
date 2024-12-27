const multer = require('multer');
const uuid = require('uuid').v4;
const path = require('path');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'product-data/uploads/'); // Dosyaların kaydedileceği klasör
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, uuid() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
};

module.exports = multer({
    storage: storage,
    fileFilter: fileFilter
});
