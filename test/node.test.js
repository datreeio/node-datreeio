/* global describe it */

require('babel-polyfill')
const fs = require('fs')
const node = require('../lib/node')
const sinon = require('sinon')
const assert = require('assert')

let packageJsonStub = `{
      "name": "datreeio",
      "version": "0.0.0",
      "description": "",
      "main": "index.js",
      "scripts": {
        "test": "nyc ./node_modules/mocha/bin/mocha test && npm run standard",
        "test-html": "nyc --reporter=html --reporter=text ./node_modules/mocha/bin/mocha test && npm run standard",
        "standard": "standard --fix --verbose | snazzy",
        "docs": "jsdoc --verbose -d docs -P package.json -R README.md *.js lib/*"
      },
      "author": "Shimon Tolts",
      "license": "ISC",
      "standard": {
        "env": [
          "mocha"
        ]
      },
      "dependencies": {
        "fs-extra": "^3.0.1",
        "nodegit": "^0.18.3"
      },
      "devDependencies": {
        "istanbul": "^0.4.5",
        "jsdoc": "^3.5.3",
        "mocha": "^3.4.2",
        "nyc": "^11.0.3",
        "sinon": "^2.3.8",
        "standard": "^10.0.2",
        "snazzy": "^7.0.0",
        "eslint": "^4.2.0"
      },
      "bundledDependencies": {
        "fakebundled": "0.0.1"
      },
      "peerDependencies": {
        "fakepeer": "0.0.1"
      },
      "optionalDependencies": {
        "fakeoptinal": "0.0.1"
      }
    }`

describe('Node.js module', async function() {
  describe('Get packages', async function() {
    it('Should extract packages from package.json', async function() {
      try {
        let deps = [
          'dependencies',
          'devDependencies',
          'bundledDependencies',
          'peerDependencies',
          'optionalDependencies'
        ]
        let packages = await node.getPackages(JSON.parse(packageJsonStub))

        for (let dep of deps) {
          assert.ok(dep in packages, `${dep} should exist`)
        }
      } catch (err) {
        assert.ifError(err)
      }
    })
  })

  it('Should check if packageJson exists', function() {
    let stub = sinon.stub(fs, 'existsSync').returns(false)
    let errmsg = 'should throw an error, package.json does not exist!'

    try {
      node.packageJsonExists('/fake/path/package.json')
      throw new Error(errmsg)
    } catch (err) {
      if (err.message === errmsg) {
        assert.fail(err.message)
      } else {
        assert.ok(err instanceof Error)
      }
    } finally {
      stub.restore()
    }
  })

  it('Should read the package.json according to package and module name', function() {
    let packagename = node.NODEJS_PACKAGE_FILENAME
    let stub = sinon
      .stub(fs, 'readFileSync')
      .returns(JSON.stringify({ package: 'json' }))
    let path = '/fake/path'
    try {
      node.readPackageJson(path)
      assert.ok(stub.args[0][0] === `${path}/${packagename}`)
    } catch (err) {
      assert.ifError(err)
    } finally {
      stub.restore()
    }
  })

  describe('extractPackageInfo', async function() {
    it('should return an empty object of package json is not found', async function() {
      let stub = sinon
        .stub(node, 'packageJsonExists')
        .throws('no package.json found')

      try {
        let res = await node.extractPackageInfo('/fake/path')
        assert.deepStrictEqual(res, {})
      } catch (err) {
        assert.ifError(err)
      } finally {
        stub.restore()
      }
    })

    it('Should extract data from package.json', async function() {
      let packages = {
        devDependencies: {
          'babel-cli': '^6.24.1',
          'babel-core': '^6.25.0',
          'babel-preset-env': '^1.6.0',
          'babel-polyfill': '^6.23.0',
          mocha: '^3.4.2',
          nyc: '^11.0.3',
          sinon: '^2.3.8',
          snazzy: '^7.0.0',
          standard: '^10.0.2'
        },
        dependencies: {
          'fs-extra': '^4.0.0',
          request: '^2.81.0',
          'request-promise-native': '^1.0.2'
        }
      }

      let stubPackageJsonExists = sinon.stub(fs, 'existsSync').returns(true)
      let stubReadPackageJson = sinon
        .stub(fs, 'readFileSync')
        .returns(packageJsonStub)
      let stubGetPackages = sinon.stub(node, 'getPackages').returns(packages)

      try {
        let res = await node.extractPackageInfo('/fake/path')
        assert.ok('packages' in res, 'packages not in package info')
        assert.ok('project_name' in res, 'project_name not in package info')
        assert.ok(
          'node_package_index' in res,
          'node_package_index not in package info'
        )
      } catch (err) {
        assert.ifError(err)
      } finally {
        stubPackageJsonExists.restore()
        stubReadPackageJson.restore()
        stubGetPackages.restore()
      }
    })

    it('extracts repository name from a shorthand name', async function() {
      const stubPackageJsonExists = sinon.stub(fs, 'existsSync').returns(true)
      const alteredPackageJsonStub = JSON.parse(packageJsonStub)
      alteredPackageJsonStub.repository = 'bla:org/repo'
      const stubReadPackageJson = sinon
        .stub(fs, 'readFileSync')
        .returns(JSON.stringify(alteredPackageJsonStub))
      const stubGetPackages = sinon.stub(node, 'getPackages').returns({})
      try {
        const res = await node.extractPackageInfo('/fake/path')
        assert.equal(res.repo_name, 'repo')
      } catch (err) {
        assert.ifError(err)
      } finally {
        stubPackageJsonExists.restore()
        stubReadPackageJson.restore()
        stubGetPackages.restore()
      }
    })

    it('extracts repository name from a shorthand name with a branch or tag (#)', async function() {
      const stubPackageJsonExists = sinon.stub(fs, 'existsSync').returns(true)
      const alteredPackageJsonStub = JSON.parse(packageJsonStub)
      alteredPackageJsonStub.repository = 'bla:org/repo#branch'
      const stubReadPackageJson = sinon
        .stub(fs, 'readFileSync')
        .returns(JSON.stringify(alteredPackageJsonStub))
      const stubGetPackages = sinon.stub(node, 'getPackages').returns({})
      try {
        const res = await node.extractPackageInfo('/fake/path')
        assert.equal(res.repo_name, 'repo')
      } catch (err) {
        assert.ifError(err)
      } finally {
        stubPackageJsonExists.restore()
        stubReadPackageJson.restore()
        stubGetPackages.restore()
      }
    })

    it('extracts repository name from a shorthand simple name', function() {
      const stubPackageJsonExists = sinon.stub(fs, 'existsSync').returns(true)
      const alteredPackageJsonStub = JSON.parse(packageJsonStub)
      alteredPackageJsonStub.repository = 'repo'
      const stubReadPackageJson = sinon
        .stub(fs, 'readFileSync')
        .returns(JSON.stringify(alteredPackageJsonStub))
      const stubGetPackages = sinon.stub(node, 'getPackages').returns({})
      try {
        const res = node.extractPackageInfo('/fake/path')
        assert.equal(res.repo_name, 'repo')
      } catch (err) {
        assert.ifError(err)
      } finally {
        stubPackageJsonExists.restore()
        stubReadPackageJson.restore()
        stubGetPackages.restore()
      }
    })

    it('extracts repository name from git url', function() {
      const stubPackageJsonExists = sinon.stub(fs, 'existsSync').returns(true)
      const alteredPackageJsonStub = JSON.parse(packageJsonStub)
      alteredPackageJsonStub.repository = {
        type: 'git',
        url: 'https://github.com/npm/repo.git'
      }
      const stubReadPackageJson = sinon
        .stub(fs, 'readFileSync')
        .returns(JSON.stringify(alteredPackageJsonStub))
      const stubGetPackages = sinon.stub(node, 'getPackages').returns({})
      try {
        const res = node.extractPackageInfo('/fake/path')
        assert.equal(res.repo_name, 'repo')
      } catch (err) {
        assert.ifError(err)
      } finally {
        stubPackageJsonExists.restore()
        stubReadPackageJson.restore()
        stubGetPackages.restore()
      }
    })

    it('extracts repository name from svn url', function() {
      const stubPackageJsonExists = sinon.stub(fs, 'existsSync').returns(true)
      const alteredPackageJsonStub = JSON.parse(packageJsonStub)
      alteredPackageJsonStub.repository = {
        type: 'svn',
        url: 'https://svn.com/repo'
      }
      const stubReadPackageJson = sinon
        .stub(fs, 'readFileSync')
        .returns(JSON.stringify(alteredPackageJsonStub))
      const stubGetPackages = sinon.stub(node, 'getPackages').returns({})
      try {
        const res = node.extractPackageInfo('/fake/path')
        assert.equal(res.repo_name, 'repo')
      } catch (err) {
        assert.ifError(err)
      } finally {
        stubPackageJsonExists.restore()
        stubReadPackageJson.restore()
        stubGetPackages.restore()
      }
    })

    it('returns an empty string for an unknown url type', function() {
      const stubPackageJsonExists = sinon.stub(fs, 'existsSync').returns(true)
      const alteredPackageJsonStub = JSON.parse(packageJsonStub)
      alteredPackageJsonStub.repository = {
        type: 'mercurial',
        url: 'https://svn.com/repo'
      }
      const stubReadPackageJson = sinon
        .stub(fs, 'readFileSync')
        .returns(JSON.stringify(alteredPackageJsonStub))
      const stubGetPackages = sinon.stub(node, 'getPackages').returns({})
      try {
        const res = node.extractPackageInfo('/fake/path')
        assert.equal(res.repo_name, '')
      } catch (err) {
        assert.ifError(err)
      } finally {
        stubPackageJsonExists.restore()
        stubReadPackageJson.restore()
        stubGetPackages.restore()
      }
    })
  })
})
