# __node-practice__
This is basic ```Node.js``` practice repository.

I followed this courses.

__[Node.js 를 이용해 웹애플리케이션 만들기]__

https://www.inflearn.com/course/nodejs-%EA%B0%95%EC%A2%8C-%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9/dashboard

__[Node.Js 활용하기]__

https://www.inflearn.com/course/node-js-%ED%99%9C%EC%9A%A9/dashboard

__[따라하며 배우는 TDD 개발]__

https://www.inflearn.com/course/%EB%94%B0%EB%9D%BC%ED%95%98%EB%A9%B0-%EB%B0%B0%EC%9A%B0%EB%8A%94-tdd

## Studied
This is what I studied from several courses.

## Index
+ [http](#http)
+ [express](#express)
+ [params, query, body](#params,query,body)
+ [templates](#templates)
+ [cookies, session](#cookies,session)
+ [security](#security)
+ [module](#module)
+ [routes](#routes)
+ [controllers](#controllers)
+ [tests](#tests)

## __http__
At first, I use http modules to connect my server.

```
const http = require('http')
```

Then, I use __http__ object that can create server.

### method 
+ createServer
    It returns object server. so we can use this server listening to some port, host.
```
const server = http.createServer()
server.listen(port, host, () => {
    console.log(` ${port} is connected `)
})
```

## __express__
But, we can use server framework, called __express__.
I use express modules to connect my server.

```
const express = require('express')
const app = express()
```

### method
Then, I can use some methods with __app__ variables.

+ listen
    It can listen to some port.
```
app.listen(3000, () => {
    console.log('3000 port is connect !!')
})
```

+ get, post
    Then, I can route using app variables.
```
app.get('/', (req, res) => {
    res.send('Welcome Home!!')
})
app.post('/topic', (req, res) => {
    const { title, description } = req.body
    console.log(title, description)
})
```

## __params,query,body__
params, query, body is property of req(request).

So, we can use this like req.params, req.query, req.body

__req.params__ can get from server url like this.
```
app.get('/topic/:id', (req, res) => {
    const id = req.params.id
})
```

__req.query__ can get from url followed by ```?``` string.
```
url => http://localhost:3000/topic?id=3
const id = req.query.id
```

__req.body__ can get only when you use body-parsing middlewares. 
By default, it is ```undefined```.
```
const bodyParser = require('body-parser')
app.use('bodyParser.json()')
```

but it is deprecated, so you can use like this using ```express```.
```
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
```

## __templates__
Template engines print software that combines some data into document.

I use __jade__ templates engine.

Tells app that 'I use jade engine' like this, and use .jade files in ```'./views'```.
```
app.set('views', './views')
app.set('view engine', 'jade')
```

## __cookies,session__
Cookies and Session have similar functions. 

```
You can check the Cookies and sessions through the Application tabs in developer tools (F12).
```

### __cookies__
Cookies can use via __cookie-parser__.

cookieParser(options) -> options' role is to ecrypt cookies data. 

When you see cookies with developer tools (F12), you can see raw cookies that are weak in security. 

So, you need to set this options.
```
const cookieParser = require('cookie-parser')
app.use(cookieParser('This is security methods'))

options exists => req.signedCookies
not exists => req.cookies

const name = req.signedCookies.name | req.cookies.name
```

### __session__
Session can use via __express-session__.

if you want to store session in file or db. you need to add store option in session.

The difference between cookies and session is that other people don't know what's key is.

session is stored in identified something (i think, more security).
```
const session = require('express-session');
const FileStore = require('session-file-store')(session)

app.use(session({
    secret: 'This is security methods',
    resave: false,
    saveUninitialized: true
    store: new FileStore() // if you want to store session in files 
}));

```

#### caution
When deletes or add sessions, redirect should proceed after that. so, callback is needed to secure flow.

```
// add sessions
req.session.id = ID
req.session.save(() => {
    req.redirect('/')
})

// delete sessions
delete req.session.id
req.session.save(() => {
    req.redirect('/')
})
```

## __security__
Security is needed when users login. so, we use some modules. (md5, pbkdf2-password, passport).

### pbkdf2-password
```
const bkfd2Password = require('pbkdf2-password');
const hasher = bkfd2Password();
```

pbkdf2-password use hasher function that needs options ({ password, salt }).

__salt__ helps password to decode more complicated.

```
hasher({ password, salt }, (err, pass, salt, hash) => {
    // err means err something happened.
    // pass means password.
    // salt means salt metioned above.
    // hash means result of password made of password and salt.
})
```

### passport
Passport is middleware of Auth certification in Node.js. 

various functions are provided by linking with express, express-session. 

And provide several strategies(local, facebook, google, etc...).

__A structure(express -> express-session, passport)__ in which session management is also included in executing the authentication logic. 
```
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy; // local
const FacebookStrategy = require('passport-facebook').Strategy; // facebook authentication
// becuase passport uses session.
app.use(session({
    secret: 'This is security methods',
    resave: false,
    saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());
```

#### strategy
There are several __strategy__ including ```local, facebook, google```.
1. User call login, or certain url.
2. Authentication check, and if it is not authenticated, excute the authentication module.
3. Comes to passport middleware, and excute according to strategy.
4. If authentication is successful, then store data in the session and go to page
5. If authentication fails, then redirect the login page.

```
// local
passport.use(new LocalStrategy((username, password, done) => {
    if (isAuthenticated) {
        done(null, user)
    } else {
        done(null, false)
    }
}))

// facebook
passport.use(new FacebookStrategy({
    clientID: 'AppID',
    clientSecret: 'Secret ID',
    callbackURL: "callback url",
    profileFields: ['email', 'id', 'gender', 'link', 'locale', 'name', 'timezone', 'updated_time', 'verified', 'displayName'] // optional information
}, (accessToken, refreshToken, profile, done) => {
    if (isAuthenticated) {
        return done(null, user)
    } 
    done(null, newUser) // register
}))

// used with middlewares in local
app.post('/auth/login', 
    passport.authenticate('local', {
        successRedirect: 'successful url',
        failureRedirect: 'failure url',
        failureFlash: false
    })
)

// scope means optional information
app.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }))

// used with middlewares in facebook
app.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: 'successful url',
    failureRedirect: 'failure url',
}))
```

done(string, boolean) => first argument mentions err message, second argument metions true or false. 

if not null, then true (ex. user information).

#### session management
Session management in __Redis__. 

If session is set in once, then call ```deserializeUser()```. 

If session is not set in once, then call ```serializeUser()```.
```
passport.serializeUser((user, done) => {
    done(null, user.authId)
})

passport.deserializeUser((id, done) => {
    if (isAuthenticated) {
        return done(null, user)
    }
    done('There is no user')
})
```

#### login, logout
```
// login
req.login(user, () => {
    req.session.save(() => {
        res.redirect('')
    })
})

// logout
req.logout()
req.session.save(() => {
    res.redirect('')
})
```

## __module__
We can make our modules. 

### single functions
```
// directory: lib/print.js
module.exports = () => console.log('hi')

const print = require('./lib/print.js)
console.log(print())
```

### several functions
```
// directory: lib/several.js
module.exports.first = () => console.log('first')
module.exports.second = () => console.log('second')

const several = require('./lib/several.js')
console.log(several.first(), several.second())
```

## __routes__
We can divide our routes into several files in folder using __express.Router()__

__In routes directory__
```
// directory: routes/first.js 
const express = require('express')
const router = express.Router();  

router.get('/first', (req, res) => console.log('first'))
router.get('/second', (req, res) => console.log('second'))
module.exports = router

// directory: routes/second.js (you can use app that is express object)
module.exports = (app) => {
    const express = require('express')
    const router = express.Router();  

    router.get('/second', (req, res) => console.log('second'))
    router.get('/third', (req, res) => console.log('third'))   
    app.get('/fourth', (req, res) => console.log('fourth'))
}
```

__In App.js__
```
const first = require('./routes/first')
app.use(first) 
const second = require('./routes/second')(app) // module is function, see above
app.use(second)
```

You can also omit prefix in url like this.
```
const first = require('./routes/first')
app.use('/first', first) // url: /first/first (o), /first (x)
```

## __controllers__
We can write function, ```middleware``` sending response from router. 

### divide routers and controllers
Callback function used in routes (middleware) can write in controllers and export modules, then use them in routes.

```From```

```
// routes/products.js
router.get('/', (req, res) => {
    res.send('Hello World!')
})
```

```To```
```
// controllers/products.js
const hello = (req, res) => {
    res.send('Hello World!')
}
module.exports = {
    hello
}

// routes/products.js
const { hello } = require('./controllers/products)
router.get('/', hello)
```

### error handling
You can use try catch blocks to handle error in server.

When error comes, ```next()``` function is executed in catch block.

But to use this method, you should write error middlewares in server.js. 

next() calls this middlewares automatically recognizing that "this is error handling middlewares!".

```
app.use((error, req, res, next) => {
    res.status(500).json({ message: error.message })
})
```

## __tests__
To test our node.js code, we can use __jest, node-mocks-http, supertest__ Libraries.

Tests consist of unit test and integration test, etc....

Directory: tests/integration, tests/unit

__how to install__

```
npm i -D jest, node-mocks-http, supertest
```

### unit test
Unit test is verification that ```specific modules``` are executed correctly.

This is independent of DB, or other external things. 

So, we use ```mock``` to replace these things and leads to not affect.

### jest
Jest find tests files in tests directory, or *.test.js, *.spec.js files.

You should make mock function with ```jest.fn()``` to track how many times called, when to use, ...etc. 

This can leads to be independent from DB because jest.fn() is fake function that have specific features(create, find, delete, upate ...)

```
productModel.create = jest.fn()
productModel.find = jest.fn()
```

### how to use
__```beforeEach```__ is called before test. So, frequently used in many tests modules declared in this block.

__```describe```__ is large unit that contains several testing modules that have similar concepts.

__```test```__ or __```it```__ is smallest unit that tests specific features. In this block, you can test with ```expecet```.

__```expect```__ is followed by __matcher__. There are many matchers.

__```matcher```__
|Name|function|
|---|---|
|toBe|```Object.is``` to test exact equality|
|toBeTruthy|matches anything that an if statement treats as ```true```|
|toStrictEqual|same as ```toEqual``` but more strict|
|toHaveBeenCalledWith|same as ```toBeCalledWith```|
|toBeDefined|matches only ```undefined```|

### node-mocks-http
This provides Mock objects like __req, res, next__. 

You can test specific modules with these objects when passing calls controllers.


### integration test
Integration test is verification that ```many modules``` are executed correctly.

file names: __*.init.test.js__

### supertest
Supertest use server module to communicate with real DB.

```
const request = require('supertest')
const app = require('../../app_tdd')

request(app).post('/products).send()
```
