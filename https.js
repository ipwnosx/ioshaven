const fs = require('fs');
const https = require('https');
const express = require('express');
const app = express()
const nunjucks = require('nunjucks')
nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.use(express.static('assets'))
app.use(express.static('/'))
https.createServer({
  key: fs.readFileSync('/key.pem'),
  cert: fs.readFileSync('/cert.pem')
}, app).listen(4430)

app.get('/', function (req, res) {
  res.render('test.html')
})
