"use strict";
const R = require("ramda");

const isUnhealthy = check => check.healthy === false;
const hasUnhealthy = R.any(isUnhealthy);

module.exports = (checks = []) => hasUnhealthy(checks);
