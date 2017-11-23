'use strict'
const os = require('os')
const path = require('path')
const osName = require('os-name')

function getSystemInfo () {
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

function getUserId () {
  return 'Anonymous' // TODO: DT-31
}

function getDatreeioDir () {
  const homeDir = os.homedir()
  return path.join(homeDir, '.datreeio')
}

module.exports = {
  getSystemInfo,
  getDatreeioDir
}
