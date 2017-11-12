"use strict";
const {
  compose,
  not,
  isNil,
  isEmpty,
  prop,
  when,
  either,
  is
} = require("ramda");
const snakeCaseKeys = require("snakecase-keys");

const nonEmpty = compose(not, either(isNil, isEmpty));

const removeEmptyFields = function(obj) {
  return Object.keys(obj).reduce((acc, field) => {
    if (nonEmpty(obj[field])) {
      acc[field] = obj[field];
    }

    return acc;
  }, {});
};

const dependentOnPresent = compose(is(String), prop("dependentOn"));
const formatDependentOn = obj =>
  Object.assign(obj, { dependentOn: { serviceName: obj.dependentOn } });
const formatDependentOnIfPresent = when(dependentOnPresent, formatDependentOn);

module.exports = compose(
  snakeCaseKeys,
  formatDependentOnIfPresent,
  removeEmptyFields
);
