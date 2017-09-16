const fs = require('fs');
const path = require('path');
const Redis = require('ioredis');
const redis = new Redis()
let json;
const _ =require('lodash')

// process.argv.forEach(function (val, index, array) {
//
// })

json = process.argv[2]
file = __dirname + json
let $json = require(file)
_.forEach($json, o => {
  redis.hset('apps', o.title.toLowerCase(), JSON.stringify(o))
  .then(process.exit)
})

//
