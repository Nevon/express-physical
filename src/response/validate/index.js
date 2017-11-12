"use strict";
const R = require("ramda");
const { validate } = require("spected");

const validator = R.curry(validate(() => true, R.head));
const rules = require("./rules");

module.exports = input => validator(rules(input))(input);
