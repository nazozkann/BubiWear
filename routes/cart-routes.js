const express = require('express');

const cartController = require('../controllers/cart-controller');
const userController = require('../controllers/user-controller'); // Import userController
const User = require('../models/user-model'); // Import User model

const router = express.Router();

router.get('/', cartController.getCart);

router.get('/checkout', async function(req, res) {
    if (!req.session.user) {
        return res.redirect('/signin'); // or whatever your signin route is
    }
    const userId = req.session.user.id;
    const user = await User.findById(userId);
    res.render('customer/cart/checkout', { addresses: user.address });
});

router.get('/add-address', function(req, res) {
    res.render('customer/cart/add-address-form', {
        address: null,
        csrfToken: req.csrfToken(),
        redirectTarget: req.query.redirect || 'cart'
    });
});

router.get('/edit-address/:addressId', userController.editAddress); // Ensure this route includes the address ID

router.post('/add-address', userController.addAddress); // Ensure this route is correctly defined

router.post('/update-address/:addressId', userController.updateAddress);

router.delete('/update-address/:addressId', userController.deleteAddress);

router.post('/checkout', function(req, res) {
    // Handle form submission and redirect to the checkout page
    res.redirect('/cart/checkout');
});

router.post('/items', cartController.addCartItem);

router.delete('/items/:itemId', cartController.removeCartItem); // Changed parameter name

module.exports = router;