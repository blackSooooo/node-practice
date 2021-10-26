const express = require('express');
const session = require('express-session');
const FileStore = require('session-file-store')(session)

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'This is security methods',
    resave: false,
    saveUninitialized: true,
    store: new FileStore()
}));

app.get('/welcome', (req, res) => {
    if(req.session.displayName) {
        res.send(`
            <h1>Hello, ${req.session.displayName}</h1>
            <a href="/auth/logout">logout</a>
            `)
    } else {
        res.send(`
            <h1>Welcome</h1>
            <a href="/auth/login">Login</a>
        `)
    }
})

app.post('/auth/login', (req, res) => {
    const user = {
        username: 'blacksooooo',
        password: '111',
        displayName: 'blackSooooo'
    }
    const { username, password } = req.body

    if(user.username == username && user.password == password) {
        req.session.displayName = user.displayName
        req.session.save(() => {
            res.redirect('/welcome')
        })
    } else {
        res.send('Who are u? <a href="/auth/login">login</a>')
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

app.get('/auth/logout', (req, res) => {
    delete req.session.displayName
    req.session.save(() => {
        res.redirect('/welcome')
    })
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