const request = require('request-promise-native')

const getWeights = async function (token) {
  let options = {
    headers: {
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
