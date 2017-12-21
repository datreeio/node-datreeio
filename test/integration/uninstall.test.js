'use strict'
const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const assert = require('assert')
const ini = require('ini')
const os = require('os')

describe('uninstall datreeio', function() {
  it('.lockfile should not exist', function() {
    assert(
      !utils.isFileSync(path.join(utils.getDatreeioDir(), 'datreeio.lock')),
      'datreeio.lock should not exist in ~/.datreeio'
    )
  })

  it('hook.js should not be configured', function() {
    let npmrc = utils.getNPMRC()
    let config = {}
    config = ini.parse(fs.readFileSync(npmrc).toString())
    assert(!config['onload-script'].endsWith('.datreeio/hook.js'))
  })
})
