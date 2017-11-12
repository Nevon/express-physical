"use strict";
const { isNil } = require("ramda");

const { notNil, oneOf } = require("./utils");
const {
  healthy: healthyMessage,
  unhealthy: unhealthyMessage
} = require("../messages");
const severities = require("../../../constants/severities");

const SHOULD_BE_OMITTED_MESSAGE = healthyMessage("Severity should be omitted");
const IS_REQUIRED_MESSAGE = unhealthyMessage("Severity is required");
const IS_ONE_OF_SEVERITIES_MESSAGE = unhealthyMessage(
  `Severity should be one of ${Object.keys(severities).join(", ")}`
);

const oneOfSeverities = oneOf(severities);

module.exports = ({ healthy }) =>
  healthy === true
    ? [[isNil, SHOULD_BE_OMITTED_MESSAGE]]
    : [
        [notNil, IS_REQUIRED_MESSAGE],
        [oneOfSeverities, IS_ONE_OF_SEVERITIES_MESSAGE]
      ];
