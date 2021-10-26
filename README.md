# __node-practice__
This is basic Node.js practice repository.

I followed this courses.

[Node.js 를 이용해 웹애플리케이션 만들기]
https://www.inflearn.com/course/nodejs-%EA%B0%95%EC%A2%8C-%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9/dashboard

[Node.Js 활용하기]
https://www.inflearn.com/course/node-js-%ED%99%9C%EC%9A%A9/dashboard

## Studied

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

## __params vs query, body__
params, query, body is property of req(request).
So, we can use this like req.params, req.query, req.body

__req.params__ can get from server url like this
```
app.get('/topic/:id', (req, res) => {
    const id = req.params.id
})
```

__req.query__ can get from url followed by __?__ string
```
url => http://localhost:3000/topic?id=3
const id = req.query.id
```

__req.body__ can get only when you use body-parsing middlewares. 
By default, it is __undefined__.
```
const bodyParser = require('body-parser')
app.use('bodyParser.json()')
```

but it is deprecated, so you can use like this using express.
```
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
```

## __templates__
template engines print software that combines some data into document.

I use __jade__ templates engine.

Tells app that 'I use jade engine' like this, and use .jade files in './views'.
```
app.set('views', './views')
app.set('view engine', 'jade')
```

## __cookies vs session__
Cookies and Session have similar functions. 

```
You can check the Cookies and sessions through the Application tabs in developer tools (F12).
```

### __cookies__
Cookies can use via __cookie-parser__.
cookieParser(options) -> options' role is to ecrypt cookies data. When you see cookies with developer tools (F12), you can see raw cookies that are weak in security. So, you need to set this options.
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
When deletes or add sessions, redirect should proceed after that. So, callback is needed to secure flow.

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