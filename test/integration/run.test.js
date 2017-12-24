'use strict'
const fs = require('fs')
const utils = require('./utils')
const path = require('path')
const assert = require('assert')

let testFile = path.join(utils.getDatreeioDir(), 'test.log')

describe('insights', function() {
  it('test.log should exist', function() {
    assert(fs.existsSync(testFile))
  })
})

describe('parse test.log', function() {
  let testFileBlog
  before(function() {
    testFileBlog = fs.readFileSync(testFile).toString()
  })

  it('test.log should be JSON formatted', function() {
    assert(JSON.parse(testFileBlog))
  })
})
