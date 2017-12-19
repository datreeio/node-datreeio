/* global describe it after before */
require('babel-polyfill')
const chai = require('chai')
const sinon = require('sinon')
const weights = require('../lib/weights')
const utils = require('../lib/utils')
const request = require('request-promise-native')

chai.should()
const EXPECTED_WEIGHTS = {
  Quality: { quality: 1 },
  Popularity: { popularity: 1 },
  Maintenance: { maintenance: 1 },
  'Internal usage': { internalUsage: 1 }
}
const TOKEN = 'abc123'

describe('weights', function() {
  let weightsRes
  const stubRequestGet = sinon
    .stub(request, 'get')
    .resolves({ weights: EXPECTED_WEIGHTS })
  const stubGetVersion = sinon.stub(utils, 'getVersion').returns('1.0.0')
  before(async function() {
    weightsRes = await weights.getWeights(TOKEN)
  })

  after(function() {
    stubRequestGet.restore()
  })

  it('gets the right weights for the user', function() {
    weightsRes.should.equal(EXPECTED_WEIGHTS)
  })
})
