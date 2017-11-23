/* global describe it */

require('babel-polyfill')
const assert = require('assert')
const args = require('../lib/args')

describe('Argv module', async function () {
  it('returns a package list when calling extractPackagesArgv', function () {
    let packages = args.extractPackagesArgv(['sinon', 'co', '--save'])
    assert.ok(packages.length === 2)
    assert.ok(packages.includes('sinon'))
    assert.ok(packages.includes('co'))
  })

  it('does not include npm internal commands in package list when calling extractPackagesArgv', function () {
    let packages = args.extractPackagesArgv(['sinon', 'co', '--save'])
    assert.ok(!packages.includes('--save'))
  })

  it('returns action args when extractActionArgs is called', function () {
    const actionArgs = args.extractActionArgs(['co', '--save'])
    assert.deepEqual(actionArgs, ['--save'])
  })

  it('excludes package names when extractActionArgs is called', function () {
    const actionArgs = args.extractActionArgs(['co', '--save'])
    assert.ok(!actionArgs.includes('co'))
  })
})
