const Product = require('../models/product-model');
const Order = require('../models/order-model');

async function getProducts(req, res, next) {
    try {
        const products = await Product.findAll();
        res.render('admin/products/all-products', { products: products });
    } catch (error) {
        next(error);
        return;
    }
}

function getNewProduct(req, res) {
    res.render('admin/products/new-product');
}

async function createNewProduct(req, res, next) {
    const images = req.files ? req.files.map(file => file.filename) : [];

    const productData = {
        ...req.body,
        colors: Array.isArray(req.body.colors) ? req.body.colors : [req.body.colors].filter(Boolean),
        sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes].filter(Boolean),
        image1: images[0] || null,
        image2: images[1] || null,
        image3: images[2] || null,
        image4: images[3] || null
    };

    const product = new Product(productData);

    try {
        await product.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

async function getUpdateProduct(req, res, next) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            const error = new Error('Could not find product.');
            error.statusCode = 404;
            throw error;
        }
        product.updateImageData(); // Ensure image URLs are generated
        res.render('admin/products/update-product', { product: product });
    } catch (error) {
        next(error);
    }
}

async function updateProduct(req, res, next) {
    const existingProduct = await Product.findById(req.params.id);

    const product = new Product({
        ...req.body,
        colors: Array.isArray(req.body.colors) ? req.body.colors : [req.body.colors].filter(Boolean),
        sizes: Array.isArray(req.body.sizes) ? req.body.sizes : [req.body.sizes].filter(Boolean),
        image1: existingProduct.image1,
        image2: existingProduct.image2,
        image3: existingProduct.image3,
        image4: existingProduct.image4,
        _id: req.params.id
    });

    if (req.files && req.files.length > 0) {
        const images = req.files.map(file => file.filename);
        product.replaceImages(images);
    }

    try {
        await product.save();
    } catch (error) {
        next(error);
        return;
    }

    res.redirect('/admin/products');
}

async function getOrders(req, res, next) {
  try {
    const orders = await Order.findAll();
    res.render('admin/orders/admin-orders', {
      orders: orders,
      isAdmin: true
    });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(req, res, next) {
  const orderId = req.params.id;
  const newStatus = req.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    res.json({ message: 'Order updated', newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
    let product;
    try {
        product = await Product.findById(req.params.id);
        await product.remove();
    } catch (error) {
        return next(error);
    }
    res.json({ message: 'Delete success!' });
}

module.exports = {
    getProducts: getProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct,
    getUpdateProduct: getUpdateProduct,
    updateProduct: updateProduct,
    deleteProduct: deleteProduct,
    getOrders: getOrders,
    updateOrder: updateOrder
};