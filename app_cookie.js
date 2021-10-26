const express = require('express');
const cookieParser = require('cookie-parser')

const app = express();

app.use(cookieParser('This is security methods'));

const products = {
    1: { 
        title: 'The history of web 1'
    },
    3: {
        title: 'The next web'
    }
}

app.get('/products', (req, res) => {
    let output = '';
    for(let product in products) {
        output += `
        <li>
            <a href="/cart/${product}">
                ${products[product].title}
            </a>
        </li>`
    }
    const result = `
    <h1>
        Products
    </h1>
    <ul>${output}</ul>
    <a href="/cart">Cart</a>`
    res.send(result)
})

app.get(['/cart', '/cart/:id'], (req, res) => {
    const id = req.params.id
    if(id) {
        let cart
        if(req.signedCookies.cart) {
            cart = req.signedCookies.cart
        } else {
            cart = {}        
        }
        if(!cart[id])   cart[id] = 0
        cart[id] = parseInt(cart[id]) + 1
        res.cookie('cart', cart, { signed: true })
        res.redirect('/cart')
    } else {
        const cart = req.signedCookies.cart
        let output = '';
        if(!cart) {
            res.send('Empty!')
        } else {
            for (let id in cart) {
                output += `<li>${products[id].title} (${cart[id]})</li>`
            }
        }
        const result = `
        <h1>Cart</h1>
        <ul>${output}</ul>
        <a href="/products">Products Lists</a>`
        res.send(result)
    }
})

app.get('/count', (req, res) => {
    let count
    if (req.signedCookies.count) {
        count = parseInt(req.signedCookies.count)
    } else {
        count = 0
    }
    count = count + 1
    res.cookie('count', count, { signed: true });
    res.send('count : ' + count);
})

app.listen(3000, () => {
    console.log('3000 port is connected!!')
})