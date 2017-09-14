const express =require('express')
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
const Redis = require('ioredis');
const redis = new Redis();
const _ =require('lodash')
const bodyParser  =  require('body-parser')
const nunjucks = require('nunjucks')
const axios = require('axios')
const crypto = require('crypto')
const env = require('./env.json')
const fileUpload = require('express-fileupload');
const fs = require('fs')

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.use(express.static('assets'))
app.use(express.static('favicomatic'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(fileUpload())

server.listen(8000)

app.get('/', home)
app.get('/upload/:folder', getUpload)
app.post('/upload/:folder', upload)
app.get('/apps', apps)
app.get('/files', getFiles)

function readdir(path) {
  return new Promise(function(resolve, reject) {
    fs.readdir(path, function(err, items) {
        if (err) reject(err)
        resolve(items)
    });
  });
}


function home(req, res){
  res.render('home.html')
}

function getUpload(req, res) {
  res.render('upload.html', {
    folder: req.params.folder
  })
}

function upload(req, res){
  if (!req.files) return res.status(400).send('No files were uploaded!')

  let u = req.files.file
  let l = `/uploads/${req.params.folder}/${u.name}`

  u.mv(__dirname + l, function (err) {
    if (err) return res.status(500).send(err)
    res.send('File Uploaded')
  })
}

function getFiles(req, res){
  let ipas, images;
  return readdir(__dirname + '/uploads/ipas')
  .then(items => {
    ipas = items
    return readdir(__dirname + '/uploads/images')
  })
  .then(items => {
    images = items
    return res.json({
      ipas: ipas,
      images: images
    })
  })
  .catch(err => {
    return res.json(err)
  })
}


function apps(req, res){
  res.render('apps.html')
}
