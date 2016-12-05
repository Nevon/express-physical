const { types, severities } = require('./constants')
const response = require('./response/response')
const ensureCallback = require('./lib/ensure-callback')

const physical = function (checks = []) {
  checks = checks.map(ensureCallback)

  return function (req, res, next) {
    try {
      if (checks.length > 0) {
        checks[0]()
      }
    } catch (e) {
      next(e)
    }

    return {}
  }
}

physical.response = response
physical.type = types
physical.severity = severities

module.exports = physical
