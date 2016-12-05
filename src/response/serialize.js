const R = require('ramda')
const snakeCaseKeys = require('snakecase-keys')

const removeEmptyFields = function (obj) {
  return Object.keys(obj).reduce((acc, field) => {
    if (R.compose(R.not, R.either(R.isNil, R.isEmpty))(obj[field])) {
      acc[field] = obj[field]
    }

    return acc
  }, {})
}

const formatDependentOn = R.when(
  R.compose(R.curry(R.is(String)), R.curry(R.prop('dependentOn'))),
  (obj) => Object.assign(obj, { dependentOn: { serviceName: obj.dependentOn } })
)

module.exports = R.compose(snakeCaseKeys, formatDependentOn, removeEmptyFields)
