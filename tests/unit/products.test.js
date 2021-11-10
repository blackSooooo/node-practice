const productController = require('../../controllers/products')
const productModel = require('../../models/Product')
const httpMocks = require('node-mocks-http')
const newProduct = require('../../data/new-product.json')
const allProducts = require('../../data/all-products.json')

productModel.create = jest.fn()
productModel.find = jest.fn()
productModel.findById = jest.fn()
productModel.findByIdAndUpdate = jest.fn()
productModel.findByIdAndDelete = jest.fn()

const productId = '35f3qwrf2f3qrffqfw'
const updateProduct = { name: 'updated name', description: 'updated description' }

let req, res, next
beforeEach(() => {
    req = httpMocks.createRequest()
    res = httpMocks.createResponse()
    next = jest.fn()
})

describe('Product Controller Create', () => {
    beforeEach(() => {
        req.body = newProduct
    })
    test('should have a createProduct function', () => {
        expect(typeof productController.createProduct).toBe('function')
    })
    test('should call productModel.create', async () => {
        await productController.createProduct(req, res, next)
        expect(productModel.create).toBeCalledWith(newProduct)
    })
    test('should return 201 response code', async () => {
        await productController.createProduct(req, res, next)
        expect(res.statusCode).toBe(201)
        expect(res._isEndCalled()).toBeTruthy()
    })
    test('should return json body in response', async () => {
        productModel.create.mockReturnValue(newProduct)
        await productController.createProduct(req, res, next)
        expect(res._getJSONData()).toStrictEqual(newProduct)
    })
    test('should handle error', async () => {
        const errMsg = { message: "description property missing" }
        const rejectedPromise = Promise.reject(errMsg)
        productModel.create.mockReturnValue(rejectedPromise)
        await productController.createProduct(req, res, next)
        expect(next).toBeCalledWith(errMsg)
    })
})

describe('Product Controller Get', () => {
    test('should have a getProduct function', () => {
        expect(typeof productController.getProduct).toBe('function')
    })
    test('should call ProductModel.find({})', async () => {
        await productController.getProduct(req, res, next)
        expect(productModel.find).toHaveBeenCalledWith({})
    })
    test('should return 200 response', async () => {
        await productController.getProduct(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
    })
    test('should return json body in response', async () => {
        productModel.find.mockReturnValue(allProducts)
        await productController.getProduct(req, res, next)
        expect(res._getJSONData()).toStrictEqual(allProducts)
    })
    test('should handle error', async () => {
        const errMsg = { message: "Error finding product data" } 
        const rejectPromise = Promise.reject(errMsg)
         productModel.find.mockReturnValue(rejectPromise)
         await productController.getProduct(req, res, next)
         expect(next).toHaveBeenCalledWith(errMsg)
    })
})

describe('Product Controller GetById', () => {
    test('should have a getProductById function', () => {
        expect(typeof productController.getProductById).toBe('function')
    })
    test('should call productModel.findById', async () => {
        req.params.productId = productId
        await productController.getProductById(req, res, next)
        expect(productModel.findById).toBeCalledWith(productId)
    })
    test('should return json body and response code 200', async () => {
        productModel.findById.mockReturnValue(newProduct)
        await productController.getProductById(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(newProduct)
        expect(res._isEndCalled()).toBeTruthy()
    })
    test('should return 404 when item doesnt exist', async () => {
        productModel.findById.mockReturnValue(null)
        await productController.getProductById(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
    test('should handle error', async () => {
        const errMsg = { message: 'Error' }
        const rejectPromise = Promise.reject(errMsg)
        productModel.findById.mockReturnValue(rejectPromise)
        await productController.getProductById(req, res, next)
        expect(next).toHaveBeenCalledWith(errMsg)
    })
})

describe('Product Controller Update', () => {
    test('should have an updateProduct function', () => {
        expect(typeof productController.updateProduct).toBe('function')
    })
    test('should call productModel.findByIdAndUpdate', async () => {
        req.params.productId = productId
        req.body = updateProduct
        await productController.updateProduct(req, res, next)
        expect(productModel.findByIdAndUpdate).toHaveBeenCalledWith(
            productId, { name: 'updated name', description: 'updated description' }, { new: true }
        )
    })
    test('should return json body and response code 200', async () => {
        req.params.productId = productId
        req.body = updateProduct
        productModel.findByIdAndUpdate.mockReturnValue(updateProduct)
        await productController.updateProduct(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._isEndCalled()).toBeTruthy()
        expect(res._getJSONData()).toStrictEqual(updateProduct)
    })
    test('should handle 404 when item doenst exist', async () => {
        productModel.findByIdAndUpdate.mockReturnValue(null)
        await productController.updateProduct(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()  
    })
    test('should handle errors', async () => {
        const errMsg = { message: 'error' }
        const rejectPromise = Promise.reject(errMsg)
        productModel.findByIdAndUpdate.mockReturnValue(rejectPromise)
        await productController.updateProduct(req, res, next)
        expect(next).toHaveBeenCalledWith(errMsg)
    })
})

describe('Product Controller Delete', () => {
    test('should have a deleteProduct function', () => {
        expect(typeof productController.deleteProduct).toBe('function')
    })
    test('should call ProductModel.findByIdAndDelete', async () => {
        req.params.productId = productId
        await productController.deleteProduct(req, res, next)
        expect(productModel.findByIdAndDelete).toBeCalledWith(productId)
    })
    test('should return 200 response', async () => {
        let deletedProduct = {
            name: 'delete product',
            description: 'it is deleted'
        }
        productModel.findByIdAndDelete.mockReturnValue(deletedProduct)
        await productController.deleteProduct(req, res, next)
        expect(res.statusCode).toBe(200)
        expect(res._getJSONData()).toStrictEqual(deletedProduct)
        expect(res._isEndCalled()).toBeTruthy()
    })
    test('should handle 404 when item doesnt exist', async () => {
        productModel.findByIdAndDelete.mockReturnValue(null)
        await productController.deleteProduct(req, res, next)
        expect(res.statusCode).toBe(404)
        expect(res._isEndCalled()).toBeTruthy()
    })
    test('should handle errors', async () => {
        const errMsg = { message: 'error deleting' }
        const rejectPromise = Promise.reject(errMsg)
        productModel.findByIdAndDelete.mockReturnValue(rejectPromise)
        await productController.deleteProduct(req, res, next)
        expect(next).toHaveBeenCalledWith(errMsg)
    })
})