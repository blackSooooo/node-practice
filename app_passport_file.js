const express = require('express');
const session = require('express-session');
const bkfd2Password = require('pbkdf2-password');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const app = express();
const hasher = bkfd2Password();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'This is security methods',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

const users = [{
    authId: 'local:blacksooooo',
    username: 'blacksooooo',
    password: 'P8TrPqnkWz3nwJ3q+P0H8GFp8gLU5ow+hh/lT4NL5cUrBABpGFEE4YMgG63jQ2BYS3MkPQ71CnoNGqE5tO1u92cJ/bdR1YkL7bRv5DKd8rM9X2n1c+N35N06eiPu/uNUi1Xq+LgBfJJnP0w5ZgS6ERX21mrOP5J5ev2dw+ba/sY=',
    displayName: 'blackSooooo',
    salt: 'MgOeUt0kzmUKmsSR7snJ7lEdQov1/+7f1NR5RcfdrCO+Leons1Bn12QyeObC6FcKl4pMNnPdzfhMco4gNIhZLA=='
}]

app.get('/welcome', (req, res) => {
    if(req.user && req.user.displayName) {
        res.send(`
            <h1>Hello, ${req.user.displayName}</h1>
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

passport.serializeUser((user, done) => {
    done(null, user.authId)
})

passport.deserializeUser((id, done) => {
    for (let idx in users) {
        const user = users[idx]
        if (user.authId === id) {
            return done(null, user)
        }
    }
    done('There is no user')
})

passport.use(new LocalStrategy((username, password, done) => {
    const uname = username
    const pwd = password
    for (let idx in users) {
        const user  = users[idx]
        if (uname == users[idx].username){
            return hasher({ password: pwd, salt: users[idx].salt }, (err, pass, salt, hash) => {
                if (hash == users[idx].password) {
                    done(null, user)
                } else {
                    done(null, false)
                }
            })
        }
    }
    done(null, false)
}))

passport.use(new FacebookStrategy({
    clientID: '601748231269750',
    clientSecret: '375de403992f890dcfa1fe93de8601a8',
    callbackURL: "/auth/facebook/callback",
    profileFields: ['email', 'id', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName']
}, (accessToken, refreshToken, profile, done) => {
    console.log(profile)
    const authId = 'facebook:' + profile.id
    for (let idx in users) {
        const user = users[idx]
        if(user.authId === authId) {
            return done(null, user)
        }
    }
    const newuser = {
        'authId': authId,
        'displayName': profile.displayName,
        'email': profile.emails[0].value
    }
    users.push(newuser)
    done(null, newuser)
}))

app.post('/auth/login', 
    passport.authenticate('local', {
        successRedirect: '/welcome',
        failureRedirect: '/auth/login',
        failureFlash: false
    })
)

app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))

app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/welcome',
    failureRedirect: '/auth/login'
}))

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
            <a href="/auth/facebook">facebook</a>
        </form>
    `
    res.send(output)
})

app.post('/auth/register', (req, res) => {
    const { username, passwrod, displayName } = req.body
    hasher({ password: passwrod }, (err, pass, salt, hash) => {
        const user = {
            authId: 'local:' + username,
            username: username,
            password: hash,
            salt: salt,
            displayName: displayName
        }
        users.push(user)
        req.login(user, (err) => {
            req.session.save(() => {
                res.redirect('/welcome')
            })
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
    req.logout()
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