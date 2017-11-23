/* global describe it */
require('babel-polyfill')
const { getSystemInfo } = require('./../lib/utils')
const assert = require('assert')

describe('Utils', function () {
  it('Should provide system info', function () {
    let data = getSystemInfo()
    let infoData = ['date_time', 'user_id', 'lang', 'lang_version', 'os_platform', 'os_release', 'node_components', 'os_name']
    for (let field of infoData) {
      assert.ok(field in data, `Should have ${field} in data`)
    }
    assert.ok(Object.keys(data).length === infoData.length, `Data should have ${infoData.length} fields and has ${Object.keys(data).length}`)
  })
})
