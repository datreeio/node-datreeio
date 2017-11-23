/* global describe it */

require('babel-polyfill')
const {getInsights} = require('./../lib/insight')
const sinon = require('sinon')
const request = require('request-promise-native')
const assert = require('assert')

describe(`Insights`, async function () {
  it(`Should report insights to server sucsessfuly`, async function () {
    let data = {shimon: 'tolts'}
    let stub = sinon.stub(request, 'post').resolves(data)

    try {
      let res = await getInsights(data)
      assert.deepStrictEqual(data, res)
    } catch (err) {
      assert.ifError(err)
    } finally {
      stub.restore()
    }
  })
  it('Should report insights to server and fail', async function () {
    let data = {shimon: 'tolts'}
    let stub = sinon.stub(request, 'post').rejects({})
    try {
      let res = await getInsights(data)
      assert.deepStrictEqual({}, res)
    } catch (err) {
      assert.ifError(err)
    } finally {
      stub.restore()
    }
  })
})
