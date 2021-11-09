const request = require('supertest')
const app = require('../../app_tdd')
const newProduct = require('../../data/new-product.json')

test("POST /products", async () => {
    const response = await request(app).post("/products").send(newProduct)
    expect(response.statusCode).toBe(201)
    expect(response.body.name).toBe(newProduct.name)
    expect(response.body.description).toBe(newProduct.description)
})

test("should return 500 on POST /products", async () => {
    const response = await request(app)
      .post("/products")
      .send({ name: "description 제외하고 보내기" });
  
    expect(response.statusCode).toBe(500);
    expect(response.body).toStrictEqual({
      message: "Product validation failed: description: Path `description` is required.",
    });
  });