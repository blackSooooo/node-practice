const productModel = require('../models/Product')

const createProduct = async (req, res, next) => {
    try {
        const newProducts = await productModel.create(req.body)
        res.status(201).json(newProducts)
    } catch (err) {
        next(err)
    }
}

const getProduct = async (req, res, next) => {
    try {        
        const allProducts = await productModel.find({})
        res.status(200).json(allProducts)
    } catch (err) {
        next(err)
    }
}

const getProductById = async (req, res, next) => {
    try {
        const product = await productModel.findById(req.params.productId)
        if(product) {
            res.status(200).json(product)   
        } else {
            res.status(404).send()
        }
    } catch (err) {
        next(err)
    }
}

const updateProduct = async (req, res, next) => {
    try {
        const updateProduct = await productModel.findByIdAndUpdate(
            req.params.productId,
            req.body,
            { new: true }
        )
        if(updateProduct) {
            res.status(200).json(updateProduct)
        } else {
            res.status(404).send()
        }
    } catch (err) {
        next(err)
    }
}

const deleteProduct = async (req, res, next) => {
    try {
        const deletedProduct = await productModel.findByIdAndDelete(req.params.productId)
        if(deletedProduct) {
            res.status(200).json(deletedProduct)
        } else {
            res.status(404).send()
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    createProduct,
    getProduct,
    getProductById,
    updateProduct,
    deleteProduct
}