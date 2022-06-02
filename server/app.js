const express = require('express')
const app = express()

const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)

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

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('upvote', commentIndex => {
    if (commentIndex === undefined || commentIndex > comments.length-1 || commentIndex < 0) return
    comments[commentIndex].upvotes += 1

    // broadcast change to all sockets
    io.emit('upvote_changed', commentIndex)
  })
});

module.exports = server;