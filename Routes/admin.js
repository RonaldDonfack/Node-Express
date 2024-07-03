const path = require('path')

const express = require('express');

const adminController = require('../Controllers/admin')

const router = express.Router();


router.get('/add-product', adminController.getAddProduct );

router.post('/add-product', adminController.postProduct);

router.get('/products' , adminController.getProducts)

module.exports = router ;
