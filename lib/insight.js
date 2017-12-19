require('babel-polyfill')

const request = require('request-promise-native')
const program = require('commander')
const auth = require('../lib/auth')
const weights = require('../lib/weights')
const loggerFactory = require('./loggerFactory')
const utils = require('./utils')

const logger = loggerFactory.get('insight')
const BASE_URL = 'https://gateway.datree.io'

program
  .option('-e, --event <event>', 'Event type')
  .option('-d, --data <data>', 'The payload')
  .parse(process.argv)

const makeRequest = async function({ uri, data, token }) {
  const headers = {
    'x-datree-sdk-type': 'nodejs',
    'x-datree-sdk-version': utils.getVersion()
  }
  let options = {
    headers,
    uri,
    body: data,
    json: true
  }
  if (token) options.headers.Authorization = `Bearer ${token}`
  return request.post(options)
}

const notifyUnInstall = async function(data, token) {
  const uri = `${BASE_URL}/uninstall`
  try {
    await makeRequest({ uri, data, token })
  } catch (err) {
    logger.error(err)
  }
}
const notifyInstall = async function(data, token) {
  const uri = `${BASE_URL}/install`
  try {
    await makeRequest({ uri, data, token })
  } catch (err) {
    logger.error(err)
  }
}

const getInsights = async function(data, token) {
  const uri = `${BASE_URL}/packages/javascript`

  try {
    const res = await makeRequest({ uri, data, token })
    return res
  } catch (err) {
    logger.error(err)
    return []
  }
}

const main = async function() {
  const token = auth.getToken()

  const data = JSON.parse(program.data)
  switch (program.event) {
    case 'install':
      await notifyInstall(data, token)
      break
    case 'uninstall':
      await notifyUnInstall(data, token)
      break
    case 'insight':
      const insight = await getInsights(data, token)
      const userWeights = await weights.getWeights(token)
      console.log(JSON.stringify({ insight, userWeights }))
      break
    default:
      logger.error(`Unknown event ${program.event}`)
  }
}

if (require.main === module) {
  main()
    .then(_ => {
      process.exit(0)
    })
    .catch(err => {
      logger.error(err)
      process.exit(1)
    })
} else {
  module.exports = {
    getInsights,
    notifyInstall,
    notifyUnInstall
  }
}
