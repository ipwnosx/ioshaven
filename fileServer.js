const express =require('express')
const app = express()
const server = require('http').Server(app)
const path = require('path')

app.use('/image', express.static(path.join(__dirname, 'uploads/images')))
app.use('/ipa', express.static(path.join(__dirname, 'uploads/ipas')))

server.listen(3000,()=>{
  console.log('server is running');
})
