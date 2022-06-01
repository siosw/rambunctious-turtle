const app = require('./app')

const PORT = 7777

app.listen(PORT, () => {
  console.log('server running on port: ', PORT)
})