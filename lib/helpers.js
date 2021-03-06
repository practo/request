'use strict'

var jsonSafeStringify = require('json-stringify-safe')
  , crypto = require('crypto')
  , uuid = require('node-uuid')

function deferMethod() {
  if (typeof setImmediate === 'undefined') {
    return process.nextTick
  }

  return setImmediate
}

function isFunction(value) {
  return typeof value === 'function'
}

function paramsHaveRequestBody(params) {
  return (
    params.body ||
    params.requestBodyStream ||
    (params.json && typeof params.json !== 'boolean') ||
    params.multipart
  )
}

function safeStringify (obj) {
  var ret
  try {
    ret = JSON.stringify(obj)
  } catch (e) {
    ret = jsonSafeStringify(obj)
  }
  return ret
}

function md5 (str) {
  return crypto.createHash('md5').update(str).digest('hex')
}

function isReadStream (rs) {
  return rs.readable && rs.path && rs.mode
}

function toBase64 (str) {
  return (new Buffer(str || '', 'utf8')).toString('base64')
}

function copy (obj) {
  var o = {}
  Object.keys(obj).forEach(function (i) {
    o[i] = obj[i]
  })
  return o
}

function version () {
  var numbers = process.version.replace('v', '').split('.')
  return {
    major: parseInt(numbers[0], 10),
    minor: parseInt(numbers[1], 10),
    patch: parseInt(numbers[2], 10)
  }
}

// Generate and return a new CID
function newCid() {
  return uuid.v4()
}

// Extract and return CID from a given request object
function extractCid(req) {
  // handle situations when headers have 'cid' instead of 'Cid'
  if (!! req.headers.Cid) {
    return req.headers.Cid
  } else if (!! req.headers.cid) {
    return req.headers.cid
  } else {
    // return a newly generated CID if no CID is found in the request
    return newCid()
  }
}

function mutateWithCid(oldHeaders) {
  if (! oldHeaders.Cid && ! oldHeaders.cid) {
    oldHeaders.Cid = newCid()
  }
  return oldHeaders
}

exports.isFunction            = isFunction
exports.paramsHaveRequestBody = paramsHaveRequestBody
exports.safeStringify         = safeStringify
exports.md5                   = md5
exports.isReadStream          = isReadStream
exports.toBase64              = toBase64
exports.copy                  = copy
exports.version               = version
exports.defer                 = deferMethod()
exports.newCid                = newCid
exports.extractCid            = extractCid
exports.mutateWithCid         = mutateWithCid
