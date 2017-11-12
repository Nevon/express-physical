"use strict";
const { isString, notEmpty } = require("./utils");
const { unhealthy: message } = require("../messages");

const SHOULD_BE_STRING_MESSAGE = message("Message should be a string");
const IS_REQUIRED_MESSAGE = message("Message is required");

module.exports = [
  [isString, SHOULD_BE_STRING_MESSAGE],
  [notEmpty, IS_REQUIRED_MESSAGE]
];
