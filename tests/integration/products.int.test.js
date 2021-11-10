const request = require('supertest')
const app = require('../../app_tdd')
const newProduct = require('../../data/new-product.json')

let firstProduct
test("POST /products", async () => {
    const response = await request(app).post("/products").send(newProduct)
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
})

test("should return 500 on POST /products", async () => {
    const response = await request(app).post("/products").send({ name: "description 제외하고 보내기" })
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Product validation failed: description: Path `description` is required.",
    });
});

test('GET /products', async () => {
  const response = await request(app).get('/products')
  expect(response.statusCode).toBe(200)
  expect(Array.isArray(response.body)).toBeTruthy()
  expect(response.body[0].name).toBeDefined()
  expect(response.body[0].description).toBeDefined()
  firstProduct = response.body[0]
})

test('GET /product/:productId', async () => {
  const response = await request(app).get('/products/' + firstProduct._id)
  expect(response.statusCode).toBe(200)
  expect(response.body.name).toBe(firstProduct.name)
  expect(response.body.description).toBe(firstProduct.description)
})

test('GET id doesnt exist /products/:productId', async () => {
  const response = await request(app).get('/products/618a682821b18afd0ef55777')
  expect(response.statusCode).toBe(404)
})

test('PUT /products', async () => {
  const res = await request(app).put('/products/' +  firstProduct._id).send({
    name: 'updated name', description: 'updated description'
  })
  expect(res.statusCode).toBe(200)
  expect(res.body.name).toBe('updated name')
  expect(res.body.description).toBe('updated description')
})

test('should return 404 on PUT /products', async () => {
  const res = await request(app).put('/products/' + "618a686e21b18afd0ef55744").send({
    name: 'updated name', description: 'updated description'
  })
  expect(res.statusCode).toBe(404)
})

test('DELETE /products', async () => {
  const res = await request(app).delete('/products/' + firstProduct._id).send()
  expect(res.statusCode).toBe(200)
})

test('DELETE id doesnt exist /products/:productId', async () => {
  const res = await request(app).delete('/products/' + "618a686e21b18afd0ef55744").send()
  expect(res.statusCode).toBe(404)
})