const shouldCompress = require('./shouldCompress')
const compress = require('./compress')
const bypass = require('./bypass')

function proxy(req, res) {
  const buffer = req.body // or get the buffer from another source
  const originType = req.headers['content-type'] || ''
  const originSize = buffer.length

  if (shouldCompress(req)) {
    compress(req, res, buffer)
  } else {
    bypass(req, res, buffer)
  }
}

module.exports = proxy
