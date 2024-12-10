const express = require('express');
const adminController = require('../controllers/admin-controller');
const imageUploadMiddleware = require('../middlewares/image-upload');
const { imageUploadErrorHandler } = require('../middlewares/error-handler'); // Destructure the correct function

const router = express.Router();

router.get('/products', adminController.getProducts);
router.get('/products/new', adminController.getNewProduct);
router.post(
    '/products',
    imageUploadMiddleware.array('images', 4),
    adminController.createNewProduct,
    imageUploadErrorHandler
);
router.get('/products/:id', adminController.getUpdateProduct);
router.post(
    '/products/:id',
    imageUploadMiddleware.array('images', 4),
    adminController.updateProduct,
    imageUploadErrorHandler
);
router.delete('/products/:id', adminController.deleteProduct);

router.get('/orders', adminController.getOrders);

router.patch('/orders/:id', adminController.updateOrder);

module.exports = router;