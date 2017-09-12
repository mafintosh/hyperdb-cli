#!/usr/bin/env node

var hyperdb = require('hyperdb')
var hprotocol = require('hprotocol')
var hyperdiscovery = require('hyperdiscovery')
var minimist = require('minimist')
var ndjson = require('ndjson')
var through = require('through2')

var argv = minimist(process.argv.slice(2))
var discovery

if (argv._[1] === 'createWriteStream') {
  var writeStream = true
  argv._[1] = null
}

var db = hyperdb(argv._[0], argv._[1], {
  valueEncoding: argv.valueEncoding || 'utf-8',
  sparse: !!argv.sparse
})

var protocol = hprotocol()
  .use('get key > values...')
  .use('put key value')
  .use('authorize key')

var client = protocol()

client.on('get', function (key, cb) {
  db.get(key, function (err, nodes) {
    if (err) return cb(err)
    if (!nodes) return cb(null, [])
    cb(null, JSON.stringify(nodes.map(n => n.value)))
  })
})

client.on('put', function (key, value) {
  db.put(key, value)
})

client.on('authorize', function (key) {
  db.authorize(key)
})

db.on('ready', function () {
  discovery = hyperdiscovery(db, {live: true})
  process.stderr.write('$ db.key = ' + db.key.toString('hex') + '\n')
  process.stderr.write('$ db.local.key = ' + db.local.key.toString('hex') + '\n')
  if (writeStream) return
  process.stdout.write(protocol.specification)
})

if (writeStream) {
  var putter = through.obj(put)
  process.stdin
    .pipe(ndjson.parse())
    .pipe(putter)
    .pipe(ndjson.serialize())
    .pipe(process.stdout)
  putter.on('finish', function () {  
    discovery.close()
  })
} else {
  process.stdin.pipe(client.stream).pipe(process.stdout)
}

function put (obj, enc, next) {
  db.put(obj.key, obj.value, function (err) {
    if (err) return next(err)
    next(null, {key: obj.key, success: true})
  })
}
