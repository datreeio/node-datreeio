const request = require('request-promise-native')
const utils = require('./utils')

const getWeights = async function(token) {
  let options = {
    headers: {
      'x-datree-sdk-type': 'nodejs',
      'x-datree-sdk-version': utils.getVersion(),
      Authorization: `Bearer ${token}`
    },
    uri: `https://gateway.datree.io/users/`,
    json: true
  }
  try {
    let res = await request.get(options)
    return res.weights
  } catch (err) {
    return {}
  }
}

module.exports = {
  getWeights
}
