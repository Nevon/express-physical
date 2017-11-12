"use strict";
const { healthy: message } = require("../messages");
const { isString, notEmpty } = require("./utils");

module.exports = [
  [isString, message("Name should be a string")],
  [notEmpty, message("Name should not be empty")]
];
