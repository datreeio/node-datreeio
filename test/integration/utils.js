'use strict'
const path = require('path')
const os = require('os')
const fs = require('fs')

function isDirSync(aPath) {
  try {
    return fs.statSync(aPath).isDirectory()
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    } else {
      throw e
    }
  }
}

function isFileSync(aPath) {
  try {
    return fs.statSync(aPath).isFile()
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    } else {
      throw e
    }
  }
}

function getNPMRC() {
  return path.join(os.homedir(), '.npmrc')
}

function getDatreeioDir() {
  const homeDir = os.homedir()
  return path.join(homeDir, '.datreeio')
}

module.exports = {
  getDatreeioDir,
  isDirSync,
  isFileSync,
  getNPMRC
}
