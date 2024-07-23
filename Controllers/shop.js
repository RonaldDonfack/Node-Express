const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
    Product.findAll()
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
    Product.findAll()
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
    Product.findByPk(productId)
        .then(product => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            })
        } )
        .catch(err => console.log(err))
   

}
exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (let product of products) {
                const cartProductData = cart.products.find(prod => prod.id === product.id)
                if (cartProductData) {
                    cartProducts.push({ productData: product, qty: cartProductData.qty })
                }
            }
            res.render('shop/cart',
                {
                    pageTitle: 'My cart',
                    path: '/cart',
                    products: cartProducts
                })
        })
    })
}

exports.postCart = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, prod => {

        Cart.addProduct(productId, prod.price);
    })
    res.redirect('/cart');
}
exports.postCartDeleteProduct = (req, res, next) => {
    const productId = req.body.productId;
    Product.findById(productId, product => {
        Cart.deleteProduct(productId, product.price);
        res.redirect('/cart');
    })
}
exports.getOrders = (req, res, next) => {
    res.render('shop/orders',
        {
            pageTitle: 'Yours orders',
            path: '/orders'
        })
}
