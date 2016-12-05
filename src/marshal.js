const R = require('ramda')

const serialize = require('./response/serialize')

const byHealth = R.groupBy((response) => response.healthy ? 'healthy' : 'unhealthy')
const serializeAll = R.curry(R.map)(serialize)

module.exports = R.compose(byHealth, serializeAll)
