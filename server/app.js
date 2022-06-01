const express = require('express')
const app = express()

app.use(express.json()) 
app.use(express.static('public'))

// exampleComment = {
//   author: 'Simon',
//   text: 'some interesting comment',
//   upvotes: 0,
// }
// the order of JSON arrays is preserved when sending them
// => we can use the index of the comment as the id as long as we reconstruct
//    the entire comments array on the frontend
let comments = []

function isValid(comment) {
  if (!comment.author || comment.author.length < 3) return false
  if (!comment.text || comment.text.length < 3) return false
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

app.post('/upvote', (req, res) => {
  const index = req.body.commentIndex
  if (index === undefined || index > comments.length-1 || index < 0) {
    res.sendStatus(400)
    return
  }

  comments[index].upvotes += 1
  res.sendStatus(200)
})

module.exports = app;