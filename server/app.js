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

function isValidComment(comment) {
  if (!comment.author || comment.author.length < 3) return false
  if (!comment.text || comment.text.length < 3) return false
  if (comment.upvotes != 0) return false
  if (!comment.isReply && (comment.replies === undefined || comment.replies.length !== 0)) return false

  return true
}

function isValidIndex(commentIndex) {
  if (commentIndex === undefined) return false
  if (commentIndex > comments.length-1 || commentIndex < 0) return false

  return true
}

app.post('/comment', (req, res) => {
  if (!isValidComment(req.body)) {
    res.sendStatus(400)
    return
  }
  
  comments.push(req.body)
  res.sendStatus(200)
})

app.get('/comments', (req, res) => {
  res.status(200).send(comments)
})

app.post('/reply', (req, res) => {
  const commentIndex = req.body.commentIndex
  if (!isValidIndex(commentIndex)) {
    res.sendStatus(400)
    return
  }

  const reply = req.body.reply
  if (!isValidComment(reply)) {
    res.sendStatus(400)
    return
  }
  
  comments[commentIndex].replies.push(reply)
  res.sendStatus(200)
})

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('upvote', commentIndex => {
    if (!isValidIndex(commentIndex)) return
    comments[commentIndex].upvotes += 1

    // broadcast change to all sockets
    io.emit('upvote_changed', commentIndex)
  })

  socket.on('reply_upvote', (commentIndex, replyIndex) => {
    if (!isValidIndex(commentIndex)) return
    comments[commentIndex].replies[replyIndex].upvotes += 1

    console.log(comments)

    // broadcast change to all sockets
    io.emit('reply_upvote_changed', commentIndex, replyIndex)
  })
});

module.exports = server;