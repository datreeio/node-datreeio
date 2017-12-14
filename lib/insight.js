require('babel-polyfill')

const request = require('request-promise-native')
const auth = require('../lib/auth')
const weights = require('../lib/weights')

const getInsights = async function(data, token) {
  let options = {
    headers: {},
    uri: 'https://gateway.datree.io/packages/javascript',
    body: data,
    json: true
  }
  if (token) options.headers.Authorization = `Bearer ${token}`

  try {
    let res = await request.post(options)
    return res
  } catch (err) {
    return []
  }
}

const main = async function() {
  const info = JSON.parse(process.argv[2])
  const token = auth.getToken()
  const insight = await getInsights(info, token)
  const userWeights = await weights.getWeights(token)

  console.log(JSON.stringify({ insight, userWeights }))
}

if (require.main === module) {
  main()
    .then(_ => {
      process.exit(0)
    })
    .catch(_ => {
      process.exit(1)
    })
} else {
  module.exports = {
    getInsights
  }
}
