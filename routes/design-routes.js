const express = require('express');

const router = express.Router();

router.get('/design', function(req, res) {
    res.render('customer/products/design');
});


module.exports = router;