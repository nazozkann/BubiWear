const Order = require('../models/order-model');
const User = require('../models/user-model');

async function getOrders(req, res,next) {
    try {
      const orders = await Order.findAllForUser(res.locals.uid);
      res.render('admin/orders/all-orders', {
        orders: orders,
      });
    } catch (error) {
      next(error);
    }
}

async function addOrder(req,res, next) {
    const cart = req.session.cart; // Changed from res.locals.cart to req.session.cart

    // Add logging to debug cart items
    console.log('Adding Order with Cart Items:', cart.items);

    // Ensure all design items include the color property
    for (const item of cart.items) {
        if (item.design && !item.design.color) {
            console.log('Design item missing color:', item); // Added logging for missing color
            return next(new Error('Design item is missing the color property.'));
        }
    }

    let userDocument;
    try {
        userDocument = await User.findById(res.locals.uid);
    } catch (error) { // Ensure error is defined
        return next(error);
    }

    const order = new Order(cart, {
        _id: userDocument._id,
        email: userDocument.email,
        fullname: userDocument.fullname,
    });

    try{
        await order.save();
    } catch (error) { // Define error parameter
        next(error);
        return;
    }

    req.session.cart = null;

    res.redirect('/cart/checkout');
}

async function updateOrderStatus(req, res, next) {
  const orderId = req.params.orderId;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);
    order.status = newStatus;
    await order.save();
    res.json({ newStatus: order.status });
  } catch (error) {
    next(error);
  }
}

module.exports = {
    addOrder: addOrder,
    getOrders: getOrders,
    updateOrderStatus: updateOrderStatus
}