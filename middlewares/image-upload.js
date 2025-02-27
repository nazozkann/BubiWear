const multer = require('multer');
const uuid = require('uuid').v4;

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'product-data/images');
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
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } 
});
