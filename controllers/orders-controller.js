const Order = require('../models/order-model');
const User = require('../models/user-model');

async function getOrders(req, res,next) {
    try {
      const orders = await Order.findAllForUser(res.locals.uid);
      res.render('customer/orders/all-orders', {
        orders: orders,
      });
    } catch (error) {
      next(error);
    }
}

async function addOrder(req,res, next) {
    const cart = res.locals.cart;

    let userDocument;
    try {
        userDocument = await User.findById(res.locals.uid);
    } catch (error) {
        return next(error);
    }

    const order = new Order(cart, userDocument);

    try{
        await order.save();
    } catch {
        next(error);
        return;
    }

    req.session.cart = null;

    res.redirect('/orders');
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