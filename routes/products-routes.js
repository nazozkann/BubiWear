const express = require('express');

const authController = require('../controllers/auth-controller');

const router = express.Router();

router.get('/products', function(req,res) {
    res.render('customer/products/t-shirts');
});

module.exports = router;