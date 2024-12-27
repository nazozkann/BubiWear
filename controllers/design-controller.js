const path = require('path');
const Design = require('../models/design-model');
const User = require('../models/user-model');

async function saveDesign(req, res, next) {
    const color = req.body.color;
    const frontImage = req.files['designImageFront'] ? req.files['designImageFront'][0].filename : null;
    const backImage = req.files['designImageBack'] ? req.files['designImageBack'][0].filename : null;

    const designData = {
        color: color,
        frontImage: frontImage ? path.join('uploads', frontImage) : null,
        backImage: backImage ? path.join('uploads', backImage) : null,
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
            design: { id: design.id, title: design.title, price: design.price },
            quantity: 1,
            totalPrice: design.price
        });

        res.redirect('/cart');
    } catch (error) {
        next(error);
    }
}

module.exports = {
    saveDesign: saveDesign
};
