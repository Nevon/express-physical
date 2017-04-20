const R = require('ramda')

const isUnhealthy = (check) => check.healthy === false

module.exports = (checks = []) => R.any(isUnhealthy)(checks)
