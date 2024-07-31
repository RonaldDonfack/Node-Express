const path = require('path');


const express = require('express');

const shopController = require('../Controllers/shop')

const router = express.Router();

router.get('/', shopController.getIndex );

router.get('/cart' , shopController.getCart);

router.post('/cart' , shopController.postCart);
router.post('/cart-delete-item', shopController.postCartDeleteProduct);

router.post('/create-ordre' , shopController.postOrder);

router.get('/orders' , shopController.getOrders);

router.get('/products/:productId' , shopController.getProduct);

router.get('/products', shopController.getProducts)
// router.get('/checkout')

module.exports = router;
