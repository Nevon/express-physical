"use strict";
const R = require("ramda");

const utils = {
  isString: R.is(String),
  isBoolean: R.is(Boolean),
  notEmpty: R.compose(R.not, R.isEmpty),
  notNil: R.compose(R.not, R.isNil),
  oneOf: collection => R.curry(R.contains)(R.__, R.keys(collection))
};

module.exports = utils;
