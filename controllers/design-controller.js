const path = require('path');
const Design = require('../models/design-model');
const User = require('../models/user-model');

async function saveDesign(req, res, next) {
    const color = req.body.color;
    console.log('Received color:', color); // Added logging to verify color

    const frontImage = req.files['designImageFront'] ? req.files['designImageFront'][0].filename : null;
    const backImage = req.files['designImageBack'] ? req.files['designImageBack'][0].filename : null;

    const designData = {
        color: color,
        frontImage: frontImage || null,
        backImage: backImage || null,
    };

    try {
        const design = new Design(designData);
        await design.save();

        if (!req.session.cart) {
            req.session.cart = { totalQuantity: 0, items: [], totalPrice: 0 };
        }
        req.session.cart.totalQuantity += 1;
        req.session.cart.totalPrice += design.price;
        req.session.cart.items.push({
            product: null,
            design: { 
                id: design.id, 
                title: design.title, 
                price: design.price, 
                color: design.color,
                frontImage: design.frontImage,
                backImage: design.backImage
            },
            quantity: 1,
            totalPrice: design.price
        });

        console.log('Session cart after adding design:', req.session.cart); // Added logging

        // Ensure the session is saved before redirecting
        req.session.save(err => {
            if (err) {
                return next(err);
            }
            res.redirect('/cart');
        });
    } catch (error) {
        next(error);
    }
}

async function getDesignById(req, res, next) {
    const designId = req.params.id;

    try {
        const design = await Design.findById(designId);
        res.render('admin/orders/design-orders', { design: design });
    } catch (error) {
        next(error);
    }
}

module.exports = {
    saveDesign: saveDesign,
    getDesignById: getDesignById // Export the new controller method
};



