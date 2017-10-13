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
const path = require('path')
const exec = require('child_process').exec

const Dropbox = require('dropbox');
const dbx = new Dropbox({ accessToken: env.dropbox });

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.use(express.static('assets'))
app.use(express.static('favicomatic'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
app.use(fileUpload())
app.use('/image', express.static(path.join(__dirname, 'uploads/images')))
app.use('/ipa', express.static(path.join(__dirname, 'uploads/ipas')))

server.listen(8000,()=>{
  console.log('server is running');
})

app.get('/', home)
// app.get('/upload/:folder', getUpload)
// app.post('/upload/:folder', upload)
// app.get('/apps', apps)
app.get('/files', getFiles)
app.get('/read', read)
app.post('/app/save', appSave)
app.post('/app/delete', appDelete)
app.post('/json', getJSON)
app.post('/golive', goLive)
// app.get('/liveApps', liveApps)


// function readdir(path) {
//   return new Promise(function(resolve, reject) {
//     fs.readdir(path, function(err, items) {
//         if (err) reject(err)
//         resolve(items)
//     });
//   });
// }

function readFile(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function (err, data){
      if (err) reject(err)
      resolve (data)
    })
  });
}

function writeFile(path, data) {
  return new Promise(function(resolve, reject) {
    fs.writeFile(path, JSON.stringify(data, null, 2), function (err) {
      if (err) reject (err)
      resolve()
    })
  });
}





function home(req, res){
  res.render('index.html')
}
function read(req, res){
  dbx.filesDownload({path: '/env.json'})
    .then(function(response) {
      let a = response.fileBinary
      a = JSON.parse(a)
      console.log(typeof a, a);
      res.json(a)
    })

}

// function getUpload(req, res) {
//   res.render('upload.html', {
//     folder: req.params.folder
//   })
// }
//
// function upload(req, res){
//   if (!req.files) return res.status(400).send('No files were uploaded!')
//
//   let u = req.files.file
//   let l = `/uploads/${req.params.folder}/${u.name}`
//
//   u.mv(__dirname + l, function (err) {
//     if (err) return res.status(500).send(err)
//     res.send('File Uploaded')
//   })
// }
//
function getFiles(req, res){
  let ipas, images;
  let lists = {
    images: [],
    ipas: []
  }

  dbx.filesListFolder({path: '/ipas'})
    .then(function(response) {
      ipas = response.entries
      return dbx.filesListFolder({path: '/images'})
    })
    .then(function(response) {
      images = response.entries
      images.forEach(image => lists.images.push(image.name))
      ipas.forEach(ipa => lists.ipas.push(ipa.name))
      return res.json(lists)
    })
    .catch(err => {
      return res.json(err)
    })
}
//
//
// function apps(req, res){
//   res.render('apps.html')
// }
//
function appSave(req, res) {
  req.body.tags = (req.body.tags) ? req.body.tags.split(',') : ''
  for (var i = 0; i < req.body.tags.length; i++) {
    req.body.tags[i] = req.body.tags[i].trim()
  }
  readFile('saved-apps.json')
  .then(data => {
    var o = JSON.parse(data)
    o[req.body.title.toLowerCase()] = req.body
    o[req.body.title.toLowerCase()].deleted = false
    return writeFile('saved-apps.json', o)
  })
  .then (data => {
    res.end('success')
  })
}



function appDelete(req, res) {
  readFile('saved-apps.json')
  .then(data => {
    var o = JSON.parse(data)
    o[req.body.title.toLowerCase()].deleted = true
    return writeFile('saved-apps.json', o)
  })
  .then (data => {
    res.end('success')
  })
}




function getJSON(req, res) {
  if (req.body.what){
    readFile('saved-apps.json')
    .then(data => {
      var o = JSON.parse(data)
      res.json(o[req.body.what.toLowerCase()])
    })
  }else {
    readFile('saved-apps.json')
    .then(data => {
      res.json(JSON.parse(data))
    })
  }
}
function goLive(req, res) {
  readFile('saved-apps.json')
  .then(data => {
    return dbx.filesUpload({
      path: '/live-apps.js',
      contents: data ,
      mode: 'overwrite'
    })
  }).catch(console.log)
  .then(response => {
    res.end('yes')
  })
  // redis.hgetall('apps')
  // .then(apps=>{
  //   return redis.hmset('liveApps', apps)
  // })
  // .then(liveApps=>{
  //   return res.end('yes')
  // })
}

// function liveApps(req, res) {
//   redis.hgetall('liveApps')
//   .then(r=>{
//     for (key in r){
//       r[key] = JSON.parse(r[key])
//     }
//     res.json(r)
//   })
// }
