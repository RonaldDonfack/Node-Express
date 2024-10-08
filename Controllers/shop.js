
const fs = require('fs');
const path = require('path');

// const OrderItem = require('../models/order-item');
const Product = require('../models/product');
const Order = require('../models/order');
const PDFDocument = require('pdfkit')

const ITEMS_PER_PAGE = 3;

exports.getIndex = (req, res, next) => {
    let page = +req.query.page || 1;
    let totalItems;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(products => {

                    res.render('shop/index', {
                        prods: products,
                        pageTitle: "My Shop",
                        path: '/',
                        currentPage : page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                    });
                })
        })
        .catch(err => {
            console.log(err);
        })

}
exports.getProducts = (req, res, next) => {
    let page = +req.query.page || 1;
    let totalItems;
    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE)
                .then(products => {

                    res.render('shop/product-list', {
                        prods: products,
                        pageTitle: "My Shop",
                        path: '/products',
                        currentPage : page,
                        hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                        hasPreviousPage: page > 1,
                        nextPage: page + 1,
                        previousPage: page - 1,
                        lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
                    });
                })
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
    req.user.populate('cart.items.productId')
        // .excePopulate()
        .then(user => {

            const products = user.cart.items
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
                    // console.log(result);
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
    Order.find({ 'user.userId': req.user._id })

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
    req.user.populate('cart.items.productId')
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } }
            })
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user
                },
                products: products
            })
            return order.save();
        })
        .then(result => {
            req.user.clearCart()
        })
        .then(result => {
            res.redirect('/orders');
            // console.log('orders Savedin db');
        })
        .catch(err => console.log(err))
}
exports.getCheckout =(req, res, next) => {
    req.user.populate('cart.items.productId')
    // .excePopulate()
    .then(user => {

        const products = user.cart.items
        let total =0;
        products.forEach(p => {
            total += p.quantity * p.productId.price;
        })
        res.render('shop/checkout', {
            pageTitle: 'Your checkout',
            path: '/checkout',
            products: products,
            totalSum : total
        })
    }).catch(err => console.log(err))
}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            if (!order) {
                return next(new Error('No order found.'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                return next(new Error('Unauthorized'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);

            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
            );
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('-----------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize(14)
                    .text(
                        prod.product.title +
                        ' - ' +
                        prod.quantity +
                        ' x ' +
                        '$' +
                        prod.product.price
                    );
            });
            pdfDoc.text('---');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

            pdfDoc.end();
            // fs.readFile(invoicePath, (err, data) => {
            //   if (err) {
            //     return next(err);
            //   }
            //   res.setHeader('Content-Type', 'application/pdf');
            //   res.setHeader(
            //     'Content-Disposition',
            //     'inline; filename="' + invoiceName + '"'
            //   );
            //   res.send(data);
            // });
            // const file = fs.createReadStream(invoicePath);

            // file.pipe(res);
        })
        .catch(err => next(err));
} 