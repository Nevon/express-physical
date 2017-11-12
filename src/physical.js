"use strict";
const { types, severities } = require("./constants");
const response = require("./response/response");
const middleware = require("./middleware");

const physical = middleware;
physical.response = response;
physical.type = types;
physical.severity = severities;

module.exports = physical;
