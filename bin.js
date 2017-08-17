#!/usr/bin/env node

var hyperdb = require('hyperdb')
var hprotocol = require('hprotocol')
var hyperdiscovery = require('hyperdiscovery')
var minimist = require('minimist')

var argv = minimist(process.argv.slice(2))

var protocol = hprotocol()
  .use('get key > values...')
  .use('put key value')
  .use('authorize key')

var client = protocol()
var db = hyperdb('./hyperdb', argv._[0], {
  valueEncoding: 'utf-8',
  sparse: !!argv.sparse
})

client.on('get', function (key, cb) {
  db.get(key, function (err, nodes) {
    if (err) return cb(err)
    if (!nodes) return cb(null, [])
    cb(null, nodes.map(n => n.value))
  })
})

client.on('put', function (key, value) {
  db.put(key, value)
})

client.on('authorize', function (key) {
  db.authorize(key)
})

db.on('ready', function () {
  hyperdiscovery(db, {live: true})
  process.stdout.write('$ db.key = ' + db.key.toString('hex') + '\n')
  process.stdout.write('$ db.local.key = ' + db.local.key.toString('hex') + '\n')
  process.stdout.write(protocol.specification)
})
process.stdin.pipe(client.stream).pipe(process.stdout)
