const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');

const p = path.join(rootDir, 
    'data', 
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, buffer) => {
            let cart = {products: [], totalPrice: 0};
            if (!err) {
                cart = JSON.parse(buffer);
            }

            const existingProductIndex = cart.products.findIndex(p => p.id === id);
            const existingProduct = cart.products[existingProductIndex];
            let updatedProduct;
            
            if (existingProduct) {
                updatedProduct = {...existingProduct};
                updatedProduct.qty = updatedProduct.qty + 1;
                cart.products = [...cart.products];
                cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 };
                cart.products = [...cart.products, updatedProduct];
            }

            cart.totalPrice += +productPrice;

            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static deleteProduct(id, productPrice) {
        fs.readFile(p, (err, buffer) => {
            if (err) {
                return;
            }
            const updatedCart = { ...JSON.parse(buffer) };
            const product = updatedCart.products.find(p => p.id === id);

            if (product) {
                const productQty = product.qty;
                updatedCart.products = updatedCart.products.filter(p => p.id !== id);
                updatedCart.totalPrice  -= +productPrice * productQty;
    
                fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                    console.log(err);
                });
            }
        });
    }

    static getCart(cb) {
        fs.readFile(p, (err, buffer) => {
            const cart = JSON.parse(buffer);
            if (err) {
                cb(null);
            } else {
                cb(cart);
            }
        });
    }
};