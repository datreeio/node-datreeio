'use strict'
const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const assert = require('assert')
const ini = require('ini')
const os = require('os')

describe('install datreeio', function() {
  it('folder ~/.datreeio should exist', function() {
    assert(utils.isDirSync(utils.getDatreeioDir()), '~/.datreeio dir should exist')
  })

  it('.lockfile should not exist', function() {
    assert(
      !utils.isFileSync(path.join(utils.getDatreeioDir(), 'datreeio.lock')),
      'datreeio.lock should not exist in ~/.datreeio'
    )
  })

  it('.npmrc should exist', function() {
    assert(fs.existsSync(utils.getNPMRC()))
  })

  it('hook.js should be configured', function() {
    let npmrc = utils.getNPMRC()
    let config = {}
    config = ini.parse(fs.readFileSync(npmrc).toString())
    assert('onload-script' in config)
    assert(config['onload-script'].endsWith('.datreeio/hook.js'))
  })

  it('hook.js should exist in ~/.datreeop folder', function() {
    assert(fs.existsSync(path.join(utils.getDatreeioDir(), 'hook.js')))
  })

  it('VERSION should exist in ~/.datreeio folder', function() {
    assert(fs.existsSync(path.join(utils.getDatreeioDir(), 'VERSION')))
  })
})
