'use strict'
const fs = require('fs')
const utils = require('./utils')
const path = require('path')
const assert = require('assert')

let testFile = path.join(utils.getDatreeioDir(), 'test.log')

describe('insights', function() {
  it('test.log should not exist', function() {
    assert(!fs.existsSync(testFile))
  })
})
