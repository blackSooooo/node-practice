const express = require('express');
const app = express();
const fs = require('fs');

app.set('views', './views');
app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/topic/new', (req, res) => {
    fs.readdir('data', (err, files) => {
        if(err) res.status(500).send('Internal Server Error')
        res.render('new', { topics: files})
    })
})

app.post('/topic', (req, res) => {
    const { title, description } = req.body
    fs.writeFile('data/'+title, description, (err) => {
        if(err) res.status(500).send('Internal Server Error')
        res.redirect('/topic/'+title)
    })
})

app.get(['/topic', '/topic/:id'], (req, res) => {
    fs.readdir('data', (err, files) => {
        if(err) res.status(500).send('Internal Server Error')
        const id = req.params.id

        if (id) {
            fs.readFile('data/'+id, (err, data) => {
                if(err) res.status(500).send('Internal Server Error')
                res.render('view', { 
                    topics: files, 
                    title: req.params.id, 
                    description: data 
                })
            })  
        } else {
            res.render('view', { topics: files, title: 'Welcome', description: 'Hello, Javascript for Server.' })
        }  
    })
})

app.listen(3000, () => {
    console.log('3000 port is connected !!')
})