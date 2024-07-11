const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {

    static addProduct(id, productPrice) {
        // fetch the previous cart 
        fs.readFile(p, (err, fileContent) => {
            let cart = { products: [], totalPrice: 0 }
            if (!err) {
                cart = JSON.parse(fileContent);
            }
            // Analyse the cart => find existing product in cart 
            const existingProductIndex = cart.products.findIndex(prod => prod.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            //  Add new product / increase the quantity 

            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty += 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.product, updatedProduct];
            }
            cart.totalPrice += +productPrice;
            fs.writeFile(p, JSON.stringify(cart), err => {
                console.log(err)
            })

        })

    }
    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            if (err)
                return;
            const updatedCart = { ...JSON.parse(fileContent) };
            const product = updatedCart.products.find(p => p.id === id);
            const productQty = product.qty;
            updatedCart.products = updatedCart.products.filter(prod => prod.id !== id);
            updatedCart.totalPrice -= (+productPrice * +productQty);
            fs.writeFile(p, JSON.stringify(updatedCart), err => {
                console.log(err)
            })

        })
    }
    static getCart(callback) {
        fs.readFile(p, (err , fileContent) => {
            const cart = JSON.parse(fileContent);
            if(err) 
                callback(null);
            else
                callback(cart);
        })
    }
}