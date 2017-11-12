"use strict";
const fieldValidationRules = {
  healthy: require("./healthy"),
  dependentOn: require("./dependent-on"),
  name: require("./name"),
  type: require("./type"),
  actionable: require("./actionable"),
  severity: require("./severity"),
  message: require("./message")
};

const commonRules = input => ({
  healthy: fieldValidationRules.healthy,
  dependentOn: fieldValidationRules.dependentOn(input)
});

const healthyRules = input => ({
  name: fieldValidationRules.name,
  type: fieldValidationRules.type,
  actionable: fieldValidationRules.actionable,
  severity: fieldValidationRules.severity(input)
});

const unhealthyRules = input => ({
  severity: fieldValidationRules.severity(input),
  message: fieldValidationRules.message
});

module.exports = input =>
  Object.assign(
    commonRules(input),
    (input.healthy === true ? healthyRules : unhealthyRules)(input)
  );
