
const express = require('express');

const shopController = require('../Controllers/shop')
const isAuth = require('../middleware/is-auth');

const router = express.Router();

router.get('/', shopController.getIndex );

router.get('/products', shopController.getProducts)

router.get('/products/:productId' ,  isAuth, shopController.getProduct);

router.get('/cart' ,  isAuth, shopController.getCart);

router.post('/cart' ,  isAuth, shopController.postCart);

router.post('/cart-delete-item', isAuth, shopController.postCartDeleteProduct);

router.post('/create-ordre' , isAuth, shopController.postOrder);

router.get('/orders' , isAuth, shopController.getOrders);

router.get('/orders/:orderId' , isAuth, shopController.getInvoice);


router.get('/checkout', isAuth, shopController.getCheckout)

module.exports = router;
