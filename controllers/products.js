const productModel = require('../models/Product')

const createProduct = async (req, res, next) => {
    try {
        const newProducts = await productModel.create(req.body)
        res.status(201).json(newProducts)
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createProduct
}