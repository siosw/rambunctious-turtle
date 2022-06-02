const server = require('./app')

const PORT = 7777

server.listen(PORT, () => {
  console.log('server running on port: ', PORT)
})