const express = require('express')
const router = express.Router()
const { createProduct } = require('../controllers/products')

router.post('/', createProduct)

module.exports = router