const request = require('supertest')
const app = require('../server/app')

describe('test root path', () => {
  it("it should respond to GET request", () => {
    return request(app).get('/').expect(200)
  })
})