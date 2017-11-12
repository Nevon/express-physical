"use strict";
const createSuffix = healthy =>
  `when healthcheck is ${healthy ? "healthy" : "unhealthy"}`;
const SUFFIX_HEALTHY_MSG = createSuffix(true);
const SUFFIX_UNHEALTHY_MSG = createSuffix(false);

const healthyCheckMessage = msg => `${msg} ${SUFFIX_HEALTHY_MSG}`;
const unhealthyCheckMessage = msg => `${msg} ${SUFFIX_UNHEALTHY_MSG}`;

module.exports = {
  healthy: healthyCheckMessage,
  unhealthy: unhealthyCheckMessage
};
