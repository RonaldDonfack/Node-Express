// const OrderItem = require('../models/order-item');
const Product = require('../models/product');

const { where } = require('sequelize');

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: "My Shop",
                path: '/'
            });
        })
        .catch(err => {
            console.log(err);
        })

}
exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: "My Shop",
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        })


}

exports.getProduct = (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        })
        .catch(err => console.log(err))


}
exports.getCart = (req, res, next) => {
    req.user.getCart()
        .then(products => {
            res.render('shop/cart', {
                pageTitle: 'Your cart',
                path: '/cart',
                products: products
            })
        }).catch(err => console.log(err))

}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId)
        .then(product => {
            return req.user.addToCart(product)
                .then(result => {
                    console.log(result);
                    res.redirect('/cart');
                })
                .catch(err => console.log(err))
        })
    // let fetchedCart;
    // let newQuantity = 1;
    // req.user.getCart()
    //     .then(cart => {
    //         fetchedCart = cart;
    //         return cart.getProducts({ where: { id: productId } })
    //     })
    //     .then(products => {
    //         let product;
    //         if (products.length > 0)
    //             product = products[0];
    //         if (product) {
    //             const oldQuantity = product.cartItem.quantity;
    //             newQuantity = oldQuantity + 1;
    //             return product;
    //         }

    //         return Product.findByPk(productId)
    //     })
    //     .then(product => {
    //         return fetchedCart.addProduct(product, { through: { quantity: newQuantity } })
    //     })
    //     .then(result => {
    //         res.redirect('/cart');

    //     })
    //     .catch(err => console.log(err))
}
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .deleteItemFormCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    req.user.getOrders()
        .then(orders => {

            res.render('shop/orders',
                {
                    pageTitle: 'Yours orders',
                    path: '/orders',
                    orders: orders
                })
        })
        .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
    req.user.addOrder()
        .then(result => {
            res.redirect('/orders');
            console.log('orders Savedin db');
        })
        .catch(err => console.log(err))
}