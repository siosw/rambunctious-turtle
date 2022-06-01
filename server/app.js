const express = require('express')
const app = express()

app.use(express.json()) 
app.use(express.static('public'))

// exampleComment = {
//   author: 'Simon',
//   text: 'some interesting comment',
//   upvotes: 0,
// }
let comments = []

function isValid(comment) {
  if (!comment.author || comment.author.length < 3) return false
  if (!comment.text || comment.text.length < 10) return false
  if (comment.upvotes != 0) return false
  return true
}

app.post('/comment', (req, res) => {
  if (!isValid(req.body)) {
    res.sendStatus(400)
    return
  }
  
  comments.push(req.body)
  res.sendStatus(200)
})

app.get('/comments', (req, res) => {
  res.status(200).send(comments)
})

module.exports = app;