# __node-practice__
This is basic Node.js practice repository.

I followed this course [Node.js 를 이용해 웹애플리케이션 만들기] 

(https://www.inflearn.com/course/nodejs-%EA%B0%95%EC%A2%8C-%EC%83%9D%ED%99%9C%EC%BD%94%EB%94%A9/dashboard) 

## Studied

### __http__
At first, I use http modules to connect my server.

```
const http = require('http')
```

Then, I use __http__ object that can create server.

#### method 
+ createServer
    It returns object server. so we can use this server listening to some port, host.
```
const server = http.createServer()
server.listen(port, host, () => {
    console.log(` ${port} is connected `)
})
```

### __express__
But, we can use server framework, called __express__.
I use express modules to connect my server.

```
const express = require('express')
const app = express()
```

#### method
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

### __params vs query, body__
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

### __templates__
template engines print software that combines some data into document.

I use __jade__ templates engine.

Tells app that 'I use jade engine' like this, and use .jade files in './views'.
```
app.set('views', './views')
app.set('view engine', 'jade')
```
