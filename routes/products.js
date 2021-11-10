const express = require('express')
const router = express.Router()
const { createProduct, getProduct, getProductById, updateProduct, deleteProduct } = require('../controllers/products')

router.post('/', createProduct)
router.get('/', getProduct)
router.get('/:productId', getProductById)
router.put('/:productId', updateProduct)
router.delete('/:productId', deleteProduct)
module.exports = router