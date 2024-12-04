const Product = require('../models/product-model');

async function getAllProducts(req, res, next) {
    try {
        const category = req.path.split('/')[1]; // Extract category from the URL path
        const products = await Product.findByCategory(category);
        res.render(`customer/products/${category}`, { products: products });
    } catch (error) {
        next(error);
    }
}

async function getProductDetails(req,res,next) {
    try{
        const product = await Product.findById(req.params.id);
        res.render('customer/products/product-details', {product: product});
    } catch (error) {
        next(error);
    }
    
}

module.exports = {
    getAllProducts: getAllProducts,
    getProductDetails: getProductDetails
};