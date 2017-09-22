var express =require('express')
var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)
server.listen(8000, ()=>{console.log('Server is ready and listening on port 8000')})
var Redis = require('ioredis');
var redis = new Redis();
var _ =require('lodash')
const bodyParser  =  require('body-parser')
var nunjucks = require('nunjucks')
const axios = require('axios')
const crypto = require('crypto')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.use(express.static('assets'))
app.use(express.static('favicomatic'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

// this is one last test
var env = require('./env.json')

app.get('/', home)
app.get('/apps', apps)
app.get('/betas', betas)
app.get('/jailbreaks', jailbreaks)
app.get('/credits', credits)
app.get('/demo', ips)
app.get('/help', help)
app.get('/devops', admin)
app.post('/contact', contact)
app.post('/devops', login)
app.get('/donate', donate)
app.post('/get/contacts', getContacts)
app.post('/drop/contact', dropContact)

function home(req, res) {
  res.render('index.html', {title: 'iOS Haven'})
}
function apps(req, res){
  res.render('apps.html', {title: 'Apps - iOS Haven'})
}
function betas(req, res) {
  res.render('betas.html', {title: 'Betas - iOS Haven '})
}
function jailbreaks(req, res) {
  res.render('jailbreaks.html', {title: 'Jailbreaks - iOS Haven'})
}
function credits(req, res) {
  res.render('credits.html', {title: 'Credits - iOS Haven'})
}
function ips(req, res) {
  res.setHeader('Content-Type', 'application/json');
  redis.lpush('ips', JSON.stringify(req.headers))
  res.redirect('/')
  // res.send(JSON.stringify(req.headers))
}
function help(req, res) {
  res.render('help.html', {title: 'Help - iOS Haven'})
}
function contact(req,res) {
  var uniqueID = crypto.randomBytes(128).toString('base64')
  let tz = new Date().getTimezoneOffset()/60
  let sign = (tz < 0) ? '+':'-'
  redis.hsetnx("contactList", uniqueID, JSON.stringify({
    uid: uniqueID,
    firstname: req.body.firstName,
    email: req.body.email,
    body: req.body.body,
    subject: req.body.subject,
    timezone: parseInt(sign + tz),
    time: new Date( Date.now() ).getTime(),
    platform: req.headers['user-agent'],
    deleted: false
  }))
  res.end("delete")
}
function admin(req, res) {
  res.render('admin.html', {
    title: 'Admin - iOS Haven',
    showlogin: true
  })
}
function login(req, res){
  if (req.body.password === env.password ) {
    res.render('admin.html', {
      title: 'Admin - iOS Haven',
      showlogin: false
    })
  }
  else ips(req, res)
}

function donate(req, res) {
  axios.post('https://www.paypal.com/cgi-bin/webscr', {
    "cmd": "_s-xclick",
    "hosted_button_id": "E8QZHGDDUQAGY",
  }).then((r) => {
    res.send(r.data)
  })
}

function getContacts(req, res){
  redis.hgetall("contactList")
  .then((results)=>{
    var newObject = {}
    _.forEach(results, function(value,key){
      value = JSON.parse(value)
      newObject[value.uid] = value
    })
    res.send(newObject)
  })
}

function dropContact(req, res){
  var newObject = req.body
  newObject.deleted = true
  redis.hset('contactList', req.body.uid, JSON.stringify(newObject))
  .then(r=>{
    res.end('ended')
  })
}
