"use strict";
const { any } = require("ramda");

const isUnhealthy = check => check.healthy === false;
const hasUnhealthy = any(isUnhealthy);

module.exports = (checks = []) => hasUnhealthy(checks);
