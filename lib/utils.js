'use strict'
const os = require('os')
const path = require('path')
const osName = require('os-name')
const fs = require('fs')

function isDebug() {
  return Boolean(process.env.DATREE_ENV)
}

function getSystemInfo() {
  return {
    date_time: new Date().toISOString(),
    user_id: getUserId(),
    lang: 'nodejs',
    lang_version: process.version,
    os_platform: os.platform(),
    os_release: os.release(),
    os_name: osName(),
    node_components: process.versions
  }
}

function getUserId() {
  return 'Anonymous' // TODO: DT-31
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
  isDebug
}
