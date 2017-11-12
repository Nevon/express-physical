"use strict";
const R = require("ramda");
const snakeCaseKeys = require("snakecase-keys");

const nonEmpty = R.compose(R.not, R.either(R.isNil, R.isEmpty));

const removeEmptyFields = function(obj) {
  return Object.keys(obj).reduce((acc, field) => {
    if (nonEmpty(obj[field])) {
      acc[field] = obj[field];
    }

    return acc;
  }, {});
};

const dependentOnPresent = R.compose(R.is(String), R.prop("dependentOn"));
const formatDependentOn = obj =>
  Object.assign(obj, { dependentOn: { serviceName: obj.dependentOn } });
const formatDependentOnIfPresent = R.when(
  dependentOnPresent,
  formatDependentOn
);

module.exports = R.compose(
  snakeCaseKeys,
  formatDependentOnIfPresent,
  removeEmptyFields
);
