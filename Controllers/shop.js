const Product = require('../models/product');




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
   Product.findById(productId , product => console.log(product))
    res.redirect('/');
}
exports.getCart = (req, res, next) => {
    res.render('shop/cart', { pageTitle: 'My cart', path: '/cart' })
}
exports.getOrders = (req, res, next) => {
    res.render('shop/orders', { pageTitle: 'Yours orders', path: '/orders' })
}
