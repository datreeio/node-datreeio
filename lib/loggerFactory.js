const bunyan = require('bunyan')

const utils = require('./utils')

const streams = []
if (utils.isDebug()) {
  streams.push({ stream: process.stdout, level: 'debug' })
}

function get(name) {
  return bunyan.createLogger({
    name,
    streams
  })
}

module.exports = {
  get
}
