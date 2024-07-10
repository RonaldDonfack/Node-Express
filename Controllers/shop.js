const Product = require('../models/product');
const Cart = require('../models/cart');





exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index',
            { prods: products, pageTitle: "My Shop", path: '/' });

    });
}
exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list',
            { prods: products, pageTitle: "My Shop", path: '/products' });

    });
}
exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId, product => {
        console.log("product in get ", product);
        res.render('shop/product-detail', { product: product, pageTitle: product.title, path: '/products' })
    })
}
exports.getCart = (req, res, next) => {
    res.render('shop/cart', { pageTitle: 'My cart', path: '/cart' })
}
exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, prod => {
        
        Cart.addProduct(productId, prod.price);
    })
    res.redirect('/cart');
}
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { pageTitle: 'Yours orders', path: '/orders' })
}
