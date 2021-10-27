module.exports = (app) => {
    const express = require('express')
    const router = express.Router();
    
    router.get('/r1', (req, res) => {
        res.send('hello /p1/r1')
    })
    
    router.get('/r2', (req, res) => {
        res.send('hello /p1/r2')
    })

    app.get('/p3/r1', (req, res) => {
        res.send('hello /p3/r1');
    })

    return router
}