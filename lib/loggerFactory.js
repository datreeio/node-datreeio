const bunyan = require('bunyan')
const streams = []
if (process.env.DATREE_ENV) {
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
