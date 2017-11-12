"use strict";
const { isBoolean } = require("./utils");
const { healthy: message } = require("../messages");

const NOT_BOOLEAN_MESSAGE = message("Actionable should be a boolean");

module.exports = [[isBoolean, NOT_BOOLEAN_MESSAGE]];
