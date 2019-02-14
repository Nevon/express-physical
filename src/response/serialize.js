"use strict";
const R = require("ramda");
const snakeCaseKeys = require("snakecase-keys");

const removeEmptyFields = function(obj) {
  return Object.keys(obj).reduce((acc, field) => {
    if (
      R.compose(
        R.not,
        R.either(R.isNil, R.isEmpty)
      )(obj[field])
    ) {
      acc[field] = obj[field];
    }

    return acc;
  }, {});
};

const formatDependentOn = R.when(
  R.compose(
    R.is(String),
    R.prop("dependentOn")
  ),
  obj => Object.assign(obj, { dependentOn: { serviceName: obj.dependentOn } })
);

// `info` is also available as `additional_info` for compatibility reasons
const copyInfoField = R.when(
  R.compose(
    R.is(Object),
    R.prop("info")
  ),
  obj => Object.assign(obj, { additional_info: obj.info })
);

const formatKeys = obj => {
  const info = obj.info;
  const formatted = snakeCaseKeys(obj);
  return Object.assign({}, formatted, { info });
};

module.exports = R.compose(
  removeEmptyFields,
  copyInfoField,
  formatKeys,
  formatDependentOn
);
