/* global describe it before */

require('babel-polyfill')
const assert = require('assert')
const args = require('../lib/argumentsExtractor')

describe('Argv module', async function() {
  let packages, actionArgs

  before(function() {
    const argumentsExtractor = new args.ArgumentsExtractor([
      'sinon',
      'co',
      '--save'
    ])
    packages = argumentsExtractor.extractPackagesArgv()
    actionArgs = argumentsExtractor.extractActionArgs()
  })

  it('returns a package list when calling extractPackagesArgv', function() {
    assert.ok(packages.length === 2)
    assert.ok(packages.includes('sinon'))
    assert.ok(packages.includes('co'))
  })

  it('does not include npm internal commands in package list when calling extractPackagesArgv', function() {
    assert.ok(!packages.includes('--save'))
  })

  it('returns action args when extractActionArgs is called', function() {
    assert.deepEqual(actionArgs, ['--save'])
  })

  it('excludes package names when extractActionArgs is called', function() {
    assert.ok(!actionArgs.includes('co'))
  })
})
