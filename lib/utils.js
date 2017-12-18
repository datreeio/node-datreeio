const os = require('os')
const path = require('path')
const osName = require('os-name')
const fs = require('fs')

function isDebug() {
  return process.env.DATREE_ENV && process.env.DATREE_ENV !== 'ci'
}

function isCI() {
  return process.env.DATREE_ENV && process.env.DATREE_ENV === 'ci'
}

function getSystemInfo() {
  return {
    date_time: new Date().toISOString(),
    lang: 'nodejs',
    lang_version: process.version,
    os_platform: os.platform(),
    os_release: os.release(),
    os_name: osName(),
    node_components: process.versions
  }
}

function getDatreeioDir() {
  const homeDir = os.homedir()
  return path.join(homeDir, '.datreeio')
}

function writeToFile(fileName, data) {
  let fileLocation = path.join(getDatreeioDir(), fileName)
  fs.writeFileSync(fileLocation, JSON.stringify(data))
}

module.exports = {
  getSystemInfo,
  getDatreeioDir,
  writeToFile,
  isDebug,
  isCI
}
