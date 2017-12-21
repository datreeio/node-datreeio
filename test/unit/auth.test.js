/* global describe it after before */
require('babel-polyfill')
const chai = require('chai')
const sinon = require('sinon')
const utils = require('../../lib/utils')
const auth = require('../../lib/auth')

chai.should()
const EXPECTED_TOKEN = 'abcde123'

describe('auth', function () {
  let token
  const stubUtils = sinon.stub(utils, 'getDatreeioDir').returns(__dirname)
  before(function () {
    token = auth.getToken('.')
  })

  after(function () {
    stubUtils.restore()
  })

  it('gets the right token from the file', function () {
    token.should.equal(EXPECTED_TOKEN)
  })
})
