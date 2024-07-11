const path = require('path')

const express = require('express');

const adminController = require('../Controllers/admin')

const router = express.Router();


router.get('/add-product', adminController.getAddProduct );

router.post('/add-product', adminController.postProduct);

router.get('/products' , adminController.getProducts);

router.get('/edit-product/:productId', adminController.getEditProduct);

router.post('/edit-product', adminController.postEditProduct);

router.post('/delete-product', adminController.postDeleteProduct);
module.exports = router ;
