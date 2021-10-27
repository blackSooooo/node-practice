const express = require('express');
const session = require('express-session');
const bkfd2Password = require('pbkdf2-password');

const app = express();
const hasher = bkfd2Password();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'This is security methods',
    resave: false,
    saveUninitialized: true
}));

const users = [{
    username: 'blacksooooo',
    password: 'P8TrPqnkWz3nwJ3q+P0H8GFp8gLU5ow+hh/lT4NL5cUrBABpGFEE4YMgG63jQ2BYS3MkPQ71CnoNGqE5tO1u92cJ/bdR1YkL7bRv5DKd8rM9X2n1c+N35N06eiPu/uNUi1Xq+LgBfJJnP0w5ZgS6ERX21mrOP5J5ev2dw+ba/sY=',
    displayName: 'blackSooooo',
    salt: 'MgOeUt0kzmUKmsSR7snJ7lEdQov1/+7f1NR5RcfdrCO+Leons1Bn12QyeObC6FcKl4pMNnPdzfhMco4gNIhZLA=='
}]

app.get('/welcome', (req, res) => {
    if(req.session.displayName) {
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout">logout</a>
            `)
    } else {
        res.send(`
            <h1>Welcome</h1>
            <ul>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            </ul>
        `)
    }
})

app.post('/auth/login', (req, res) => {
    const { username, password } = req.body
    for (let idx in users) {
        if (username == users[idx].username){
            return hasher({ password: password, salt: users[idx].salt }, (err, pass, salt, hash) => {
                if (hash == users[idx].password) {
                    req.session.displayName = users[idx].displayName
                    req.session.save(() => {
                        res.redirect('/welcome')
                    })
                } else {
                    res.send('Who are u? <a href="/auth/login">login</a>')
                }
            })
        }
    }
})

app.get('/auth/login', (req, res) => {
    const output = `
        <h1>Login</h1>
        <form action="/auth/login" method="post">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="text" name="password" placeholder="password">
            </p>
            <p>
                <input type="submit"/>
            </p>
        </form>
    `
    res.send(output)
})

app.post('/auth/register', (req, res) => {
    const { username, passwrod, displayName } = req.body
    hasher({ password: passwrod }, (err, pass, salt, hash) => {
        const user = {
            username: username,
            password: hash,
            salt: salt,
            displayName: displayName
        }
        users.push(user)
        req.session.displayName = displayName
        req.session.save(() => {
            res.redirect('/welcome')
        })
    })
})

app.get('/auth/register', (req, res) => {
    const output = `
        <h1>Login</h1>
        <form action="/auth/register" method="post">
            <p>
                <input type="text" name="username" placeholder="username">
            </p>
            <p>
                <input type="text" name="password" placeholder="password">
            </p>
            <p>
                <input type="text" name="displayName" placeholder="displayName">
            </p>
            <p>
                <input type="submit"/>
            </p>
        </form>
    `
    res.send(output)
})

app.get('/auth/logout', (req, res) => {
    delete req.session.displayName
    res.redirect('/welcome')
})

app.get('/count', (req, res) => {
    if (req.session.count) {
        req.session.count++
    } else {
        req.session.count = 1
    }
    res.send('count :' + req.session.count)
})

app.listen(3000, () => {
    console.log('3000 port is connected!!')
})