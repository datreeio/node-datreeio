const fs = require('fs')
const path = require('path')
const utils = require('./utils')

function getToken () {
  const datreeioDir = utils.getDatreeioDir()
  const tokenPath = path.join(datreeioDir, '.token')
  let token = ''

  try {
    token = fs.readFileSync(tokenPath, {encoding: 'utf8'})
  } catch (err) {
  }
  return token
}

module.exports = {
  getToken
}
