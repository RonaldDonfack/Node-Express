// const OrderItem = require('../models/order-item');
const Product = require('../models/product');
const Order = require('../models/order');


exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            
            res.render('shop/index', {
                prods: products,
                pageTitle: "My Shop",
                path: '/',
                isAuthenticated :  req.session.isLoggedIn 
            });
        })
        .catch(err => {
            console.log(err);
        })

}
exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            
            res.render('shop/product-list', {
                prods: products,
                pageTitle: "My Shop",
                path: '/products',
                isAuthenticated :  req.session.isLoggedIn 
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
                path: '/products',
                isAuthenticated :  req.session.isLoggedIn 
            })
        })
        .catch(err => console.log(err))


}
exports.getCart = (req, res, next) => {
    req.user.populate('cart.items.productId')
    // .excePopulate()
        .then(user => {
          
            const products = user.cart.items
            res.render('shop/cart', {
                pageTitle: 'Your cart',
                path: '/cart',
                products: products,
                isAuthenticated :  req.session.isLoggedIn 
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
  
}
exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId' : req.user._id })
    
        .then(orders => {

            res.render('shop/orders',
                {
                    pageTitle: 'Yours orders',
                    path: '/orders',
                    orders: orders,
                    isAuthenticated :  req.session.isLoggedIn 
                })
        })
        .catch(err => console.log(err))
}

exports.postOrder = (req, res, next) => {
    req.user .populate('cart.items.productId')
    .then(user => {
        const products = user.cart.items.map(i => {
            return {quantity : i.quantity , product : {...i.productId._doc}}
        })
        const order = new Order({
            user : {
                name : req.user.name,
                userId: req.user
            },
            products : products
        })
        return order.save();
    })
        .then(result => {
           req.user.clearCart()
        })
        .then(result => {
            res.redirect('/orders');
            console.log('orders Savedin db');
        })
        .catch(err => console.log(err))
}