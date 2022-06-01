const request = require('supertest')
const app = require('../server/app')
const assert = require('assert')


const exampleComment = {
  author: 'Simon',
  text: 'some interesting comment',
  upvotes: 0,
}

const malformedComment = {
  text: 'some interesting comment',
}

const nonZeroUpvoteComment = {
  author: 'Simon',
  text: 'some interesting comment',
  upvotes: 999,
}

describe('test comment(s) endpoints', () => {
  it('/comment should accept a POSTed comment', () => {
    return request(app).post('/comment').send(exampleComment)
      .expect(200)
  })

  it('/comment should reject a malformed comment', () => {
    return request(app).post('/comment').send(malformedComment)
      .expect(400)
  })

  it('/comment should reject comment with non zero upvotes', () => {
    return request(app).post('/comment').send(nonZeroUpvoteComment)
      .expect(400)
  })

  it('/comments should retrieve all comments on GET', () => {
    return request(app).get('/comments')
      .expect('Content-Type', /json/)
      .expect(200)
      .then(res => {
        assert(res.body.length === 1)
        assert(JSON.stringify(res.body[0]) === JSON.stringify(exampleComment))
      })
  })
})