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
    t.equal(headers.headers['user-agent'], 'node-req')
    t.equal(headers.headers.cid, '987')
    t.end()
  })
})

tape('cid value generated using newCid()', function(t) {
  var aCid = request.newCid()
  var opt = {
    url: TARGET,
    headers: {
      'Cid': aCid
    }
  }
  request(opt, function(err, res, body) {
    t.equal(err, null)
    t.equal(res.statusCode, 200)
    var headers = JSON.parse(body)
    t.equal(headers.headers.cid, aCid)
    t.end()
  })
})

tape('extractCid value check', function(t) {
  var req = new request.Request({
    url: 'http://example.com',
    cid: '999'
  })
  t.equal(request.extractCid(req), '999')
  t.equal(1, 1)
  t.end()
})

tape('noCid option check', function(t) {
  var opt = {
    url: TARGET,
    noCid: true
  }
  request(opt, function(err, res, body) {
    t.equal(err, null)
    t.equal(res.statusCode, 200)
    var headers = JSON.parse(body)
    t.equal(headers.headers.cid, undefined)
    t.end()
  })
})

tape('header with cid and Cid', function(t) {
  var req1 = { headers: { cid: '121' } }
  var req2 = { headers: { Cid: '999' } }
  t.equal(request.extractCid(req1), '121')
  t.equal(request.extractCid(req2), '999')
  t.end()
})

tape('mutateWithCid should add cid to given headers', function(t) {
  var headers = { host: 'foo' }
  headers = request.mutateWithCid(headers)
  t.equal(!! headers.Cid, true)
  t.end()
})

tape('mutateWithCid should not change headers with Cid', function(t) {
  var headers = { Cid: '111', host: 'foo' }
  t.equal(
    JSON.stringify(request.mutateWithCid(headers)), JSON.stringify(headers)
  )
  t.end()
})

tape('mutateWithCid should not change headers with cid', function(t) {
  var headers = { cid: '222', host: 'foo' }
  t.equal(
    JSON.stringify(request.mutateWithCid(headers)), JSON.stringify(headers)
  )
  t.end()
})

tape('cleanup', function(t) {
  s.close(function() {
    t.end()
  })
})
