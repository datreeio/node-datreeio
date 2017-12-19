const os = require('os')
const path = require('path')
const osName = require('os-name')
const fs = require('fs')
const pkgJson = require('../package.json')

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
function setVersion() {
  const versionPath = path.join(getDatreeioDir(), 'VERSION')
  const version = pkgJson.version
  fs.writeFileSync(versionPath, version)
}
function getVersion() {
  const versionPath = path.join(getDatreeioDir(), 'VERSION')
  return fs
    .readFileSync(versionPath)
    .toString('utf8')
    .replace(/\n$/, '')
}

function getDatreeioDir() {
  const homeDir = os.homedir()
  return path.join(homeDir, '.datreeio')
}

function writeToFile(fileName, data) {
  let fileLocation = path.join(getDatreeioDir(), fileName)
  fs.writeFileSync(fileLocation, JSON.stringify(data))
}

function getInstallDate() {
  const datreeioDir = getDatreeioDir()
  const stats = fs.statSync(datreeioDir)
  return stats.birthtime
}

module.exports = {
  getSystemInfo,
  getDatreeioDir,
  writeToFile,
  getInstallDate,
  getVersion,
  isDebug,
  isCI
}
