const { ObjectId } = require('mongodb');
const Product = require('../models/product-model');
const Design = require('../models/design-model');

function getCart(req, res) {
    res.render('customer/cart/cart');
}

async function addCartItem(req, res, next) {
    const productId = req.body.productId;
    const designId = req.body.designId;

    let item;

    try {
        if (productId) {
            item = await Product.findById(productId);
        }

        if (!item && designId) {
            item = await Design.findById(designId);
        }

        if (!item) {
            return res.status(404).json({ message: 'Product or Design not found.' });
        }
    } catch (error) {
        next(error);
        return;
    }

    const cart = res.locals.cart;
    cart.addItem(item);
    req.session.cart = cart;

    res.status(201).json({
        message: 'Cart updated.',
        newTotalItems: cart.totalQuantity
    });
}

async function removeCartItem(req, res, next) {
    const itemId = req.params.itemId;
    const cart = res.locals.cart;
    const updatedItem = cart.removeItem(itemId);
    req.session.cart = cart;

    res.status(200).json({
        message: 'Item removed.',
        newTotalItems: cart.totalQuantity,
        newQuantity: updatedItem ? updatedItem.quantity : 0,
        newTotalPrice: cart.totalPrice
    });
}

module.exports = {
    addCartItem: addCartItem,
    getCart: getCart,
    removeCartItem: removeCartItem
}