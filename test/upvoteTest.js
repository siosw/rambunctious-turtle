const request = require('supertest')
const app = require('../server/app')
const assert = require('assert')

const exampleComment = {
  author: 'Simon',
  text: 'some interesting comment',
  upvotes: 0,
}

const exampleUpvote = {
  commentIndex: 0
}

const outOfBoundsUpvote = {
  commentIndex: 999
}

describe('test upvote endpoints', () => {
  it('/upvote should accept a POSTed upvote', async () => {
    await request(app).post('/comment').send(exampleComment)
      .expect(200)

    await request(app).post('/upvote').send(exampleUpvote)
      .expect(200)

    return request(app).get('/comments')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        assert(res.body[0].upvotes === 1)
      })
  })

  it('/upvote should reject out of bounds index', () => {
    return request(app).post('/upvote').send(outOfBoundsUpvote)
      .expect(400)
  })
})