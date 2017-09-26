const express =require('express')
const app = express()
const server = require('http').Server(app)
const path = require('path')
const Redis = require('ioredis');
const redis = new Redis();

app.use('/image', express.static(path.join(__dirname, 'uploads/images')))
app.use('/ipa', express.static(path.join(__dirname, 'uploads/ipas')))

app.get('/', liveApps)

server.listen(3000,()=>{
  console.log('server is running');
})


function liveApps(req, res) {
  redis.hgetall('liveApps')
  .then(r=>{
    for (key in r){
      r[key] = JSON.parse(r[key])
    }
    res.json(r)
  })
}
