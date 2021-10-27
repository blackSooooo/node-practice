const express = require('express')
const router = express.Router();

router.get('/r1', (req, res) => {
    res.send('hello /p2/r1')
})

router.get('/r2', (req, res) => {
    res.send('hello /p2/r2')
})

module.exports = router