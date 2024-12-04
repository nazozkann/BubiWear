const Product = require('../models/product-model');

function getCart(req, res) {
    res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.body.productId);
    } catch (error) {
        if (error.code === 404) {
            res.status(404).json({ message: 'Product not found.' });
        } else {
            next(error);
        }
        return;
    }
    const cart = res.locals.cart;
    cart.addItem(product);
    req.session.cart = cart;

    res.status(201).json({
        message: 'Cart updated.',
        newTotalItems: cart.totalQuantity
    });
}

async function removeCartItem(req, res, next) {
    const productId = req.params.productId;
    const cart = res.locals.cart;
    cart.removeItem(productId);
    req.session.cart = cart;

    res.status(200).json({
        message: 'Item removed.',
        newTotalItems: cart.totalQuantity
    });
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    removeCartItem: removeCartItem
}