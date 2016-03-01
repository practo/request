'use strict'

var request = require('../index')
  , tape = require('tape')
  , http = require('http')

var TARGET = 'http://localhost:6767'

var s = http.createServer(function (req, resp) {
  resp.statusCode = 200
  var json = JSON.stringify({
    headers: req.headers
  })
  resp.end(json)
})

tape('setup', function(t) {
  s.listen(6767, function() {
    t.end()
  })
})

tape('basic cid check', function(t) {
  request(TARGET, function(err, res, body) {
    t.equal(err, null)
    t.equal(res.statusCode, 200)
    var headers = JSON.parse(body)
    t.equal(!! headers.headers.cid, true)
    t.end()
  })
})

tape('cid value check passing in options', function(t) {
  var opt = {
    url: TARGET,
    cid: '5678'
  }
  request(opt, function(err, res, body) {
    t.equal(err, null)
    t.equal(res.statusCode, 200)
    var headers = JSON.parse(body)
    t.equal(headers.headers.cid, '5678')
    t.end()
  })
})

tape('cid value check passing in headers', function(t) {
  var opt = {
    url: TARGET,
    headers: {
      'User-Agent': 'node-req',
      'Cid': '987'
    }
  }
  request(opt, function(err, res, body) {
    t.equal(err, null)
    t.equal(res.statusCode, 200)
    var headers = JSON.parse(body)
    t.equal(headers.headers.cid, '987')
    t.end()
  })
})

tape('cleanup', function(t) {
  s.close(function() {
    t.end()
  })
})
