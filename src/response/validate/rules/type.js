"use strict";

const types = require("../../../constants/types");
const { healthy: message } = require("../messages");
const { oneOf } = require("./utils");

const INVALID_TYPE_MESSAGE = message(
  `Type should be one of ${Object.keys(types).join(", ")}`
);

const oneOfTypes = oneOf(types);

module.exports = [[oneOfTypes, INVALID_TYPE_MESSAGE]];
