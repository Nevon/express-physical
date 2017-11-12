"use strict";
const {
  is,
  compose,
  curry,
  contains,
  not,
  isEmpty,
  isNil,
  __
} = require("ramda");

const utils = {
  isString: is(String),
  isBoolean: is(Boolean),
  notEmpty: compose(not, isEmpty),
  notNil: compose(not, isNil),
  oneOf: collection => curry(contains)(__, Object.keys(collection))
};

module.exports = utils;
