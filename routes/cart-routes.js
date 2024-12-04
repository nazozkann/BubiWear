const express = require('express');

const cartController = require('../controllers/cart-controller');

const router = express.Router();

router.get('/', cartController.getCart);

router.post('/items', cartController.addCartItem);

router.delete('/items/:productId', cartController.removeCartItem);

module.exports = router;