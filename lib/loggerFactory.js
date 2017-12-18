const bunyan = require('bunyan')

const utils = require('./utils')

const streams = []
if (utils.isDebug()) {
  if (process.env.DATREE_ENV === 'test') {
    streams.push({
      path: path.join(utils.getDatreeioDir(), 'debug.log'),
      level: 'debug'
    })
  } else {
    streams.push({ stream: process.stdout, level: 'debug' })
  }
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
