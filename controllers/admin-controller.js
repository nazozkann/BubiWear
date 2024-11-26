const Product = require('../models/product-model');
const { get } = require('../routes/admin-routes');

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
    // req.files'teki tüm dosyaları bir diziye dönüştürüyoruz
    const images = Object.keys(req.files).map(key => req.files[key][0].filename);

    const productData = {
        ...req.body,
        images: images // images artık bir dizi
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
        res.render('admin/products/update-product', { product: product });
    } catch (error) {
        next(error);
    }
}

function updateProduct(req, res) {
    res.redirect('/admin/products');
}

module.exports = {
    getProducts: getProducts,
    getNewProduct: getNewProduct,
    createNewProduct: createNewProduct,
    getUpdateProduct: getUpdateProduct,
    updateProduct: updateProduct
};