/* global describe it before */

require('babel-polyfill')
const Renderer = require('../lib/cli-renderer')
const sinon = require('sinon')
const chalk = require('chalk')
const assert = require('assert')
const chai = require('chai')
const loggerFactory = require('../lib/loggerFactory')
const logger = loggerFactory.get('main')

chai.should()

describe('Renderer', function() {
  describe('renderPackagesTable', function() {
    const Table = require('cli-table')
    it('adds string representation of the table to the internal rendering queue', function() {
      sinon.spy(Table.prototype, 'toString')
      try {
        const renderer = new Renderer({ logger })
        sinon.stub(renderer, 'render').returns()
        renderer.renderPackagesTable({
          title: 'test',
          data: [
            {
              source: {
                name: 'koa',
                version: '2.4.1',
                description: 'Koa web app framework',
                score: {
                  final: 0.8524996105817684,
                  detail: {
                    quality: 0.9299749830645573,
                    popularity: 0.6387755334928945,
                    maintenance: 0.9998162255425376
                  }
                },
                publisherUsername: 'jongleberry',
                license: 'MIT',
                keywords: [
                  'web',
                  'app',
                  'http',
                  'application',
                  'framework',
                  'middleware',
                  'rack'
                ],
                deprecated: null,
                date: '2017-11-06T14:31:37.351Z',
                status: 'found',
                size: 1912,
                recommendedVersion: '2.0.0',
                usage: 1
              },
              alternatives: [
                {
                  name: 'express',
                  version: '4.16.2',
                  description: 'Fast, unopinionated, minimalist web framework',
                  score: {
                    final: 0.9632833356119104,
                    detail: {
                      quality: 0.9687175499385351,
                      popularity: 0.9660667020323657,
                      maintenance: 0.9558420711972055
                    }
                  },
                  publisherUsername: 'dougwilson',
                  license: 'MIT',
                  keywords: [
                    'express',
                    'framework',
                    'sinatra',
                    'web',
                    'rest',
                    'restful',
                    'router',
                    'app',
                    'api'
                  ],
                  deprecated: null,
                  date: '2017-10-10T03:13:46.364Z',
                  status: 'found',
                  size: 8875,
                  recommendedVersion: '4.13.3',
                  usage: 0
                },
                {
                  name: 'hapi',
                  version: '17.0.2',
                  description: 'HTTP Server framework',
                  score: {
                    final: 0.8409270468999932,
                    detail: {
                      quality: 0.9503777819771448,
                      popularity: 0.5880393445574846,
                      maintenance: 0.9999998334620863
                    }
                  },
                  publisherUsername: 'hueniverse',
                  license: 'BSD-3-Clause',
                  keywords: ['framework', 'http', 'api', 'web'],
                  deprecated: null,
                  date: '2017-11-21T07:25:37.190Z',
                  status: 'found',
                  size: 12589,
                  recommendedVersion: '16.1.0',
                  usage: 0
                }
              ]
            }
          ],
          weights: {
            Quality: { quality: 1 },
            Popularity: { popularity: 1 },
            Maintenance: { maintenance: 1 },
            'Internal usage': { internalUsage: 1 }
          }
        })
        assert(Table.prototype.toString.calledOnce)
      } catch (err) {
        assert.ifError(err)
      }
    })
  })

  describe('renderSeparator', function() {
    it('adds the separator string to the internal rendering queue', function() {
      try {
        const renderer = new Renderer({ logger })
        sinon.stub(renderer, 'render').returns()
        renderer.renderSeparator()
        assert.equal(renderer.queue.length, 1)
      } catch (err) {
        assert.ifError(err)
      }
    })
  })

  describe('render', function() {
    it('makes sure logging to the console actually occurrs', function() {
      const stub = sinon.stub(console, 'log').returns()
      try {
        const renderer = new Renderer({ logger })
        renderer.queue.push('test')
        renderer.render()
        assert(stub.calledOnce)
      } catch (err) {
        assert.ifError(err)
      } finally {
        stub.restore()
      }
    })
  })

  it('should render the json to a nice table', function() {
    let serverResponse = {
      userWeights: {
        Quality: { quality: 1 },
        Popularity: { popularity: 1 },
        Maintenance: { maintenance: 1 },
        'Internal usage': { internalUsage: 1 }
      },
      insight: [
        {
          source: {
            name: 'koa',
            version: '2.4.1',
            description: 'Koa web app framework',
            score: {
              final: 0.8524996105817684,
              detail: {
                quality: 0.9299749830645573,
                popularity: 0.6387755334928945,
                maintenance: 0.9998162255425376
              }
            },
            publisherUsername: 'jongleberry',
            license: 'MIT',
            keywords: [
              'web',
              'app',
              'http',
              'application',
              'framework',
              'middleware',
              'rack'
            ],
            deprecated: null,
            date: '2017-11-06T14:31:37.351Z',
            status: 'found',
            size: 1912,
            recommendedVersion: '2.0.0',
            usage: 1
          },
          alternatives: [
            {
              name: 'express',
              version: '4.16.2',
              description: 'Fast, unopinionated, minimalist web framework',
              score: {
                final: 0.9632833356119104,
                detail: {
                  quality: 0.9687175499385351,
                  popularity: 0.9660667020323657,
                  maintenance: 0.9558420711972055
                }
              },
              publisherUsername: 'dougwilson',
              license: 'MIT',
              keywords: [
                'express',
                'framework',
                'sinatra',
                'web',
                'rest',
                'restful',
                'router',
                'app',
                'api'
              ],
              deprecated: null,
              date: '2017-10-10T03:13:46.364Z',
              status: 'found',
              size: 8875,
              recommendedVersion: '4.13.3',
              usage: 0
            },
            {
              name: 'hapi',
              version: '17.0.2',
              description: 'HTTP Server framework',
              score: {
                final: 0.8409270468999932,
                detail: {
                  quality: 0.9503777819771448,
                  popularity: 0.5880393445574846,
                  maintenance: 0.9999998334620863
                }
              },
              publisherUsername: 'hueniverse',
              license: 'BSD-3-Clause',
              keywords: ['framework', 'http', 'api', 'web'],
              deprecated: null,
              date: '2017-11-21T07:25:37.190Z',
              status: 'found',
              size: 12589,
              recommendedVersion: '16.1.0',
              usage: 0
            }
          ]
        }
      ]
    }
    const renderer = new Renderer({ logger })
    renderer.renderPackagesTable({
      title: 'Alternative Packages',
      data: serverResponse.insight,
      weights: serverResponse.userWeights
    })
    renderer.queue.length.should.be.above(1)
  })

  describe('renderFooter', function() {
    const renderer = new Renderer({ logger })
    before(function() {
      renderer.renderFooter(['koa', 'mongoose'])
    })

    it('adds 2 entries to the queue', function() {
      renderer.queue.length.should.equal(2)
    })

    it('should have the correct links for the footer', function() {
      renderer.queue[0].should.eql(
        chalk`{blue.bold https://platform.datree.io/pkg/single-package/koa}`
      )
      renderer.queue[1].should.eql(
        chalk`{blue.bold https://platform.datree.io/pkg/single-package/mongoose}`
      )
    })
  })
})
