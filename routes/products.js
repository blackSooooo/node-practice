const express = require('express')
const router = express.Router()
const { hello, bye } = require('../controllers/products')

router.get('/', hello)

router.get('/bye', bye)

module.exports = router