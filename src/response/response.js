const R = require("ramda");

const InvalidHealthcheckResponse = require("./invalid-healthcheck-response");
const validate = require("./validate");

const createResponse = responseData =>
  R.pick(
    [
      "name",
      "healthy",
      "actionable",
      "type",
      "severity",
      "message",
      "dependentOn",
      "info",
      "link"
    ],
    responseData
  );

module.exports = function(responseData) {
  const {
    name,
    healthy,
    actionable,
    type,
    severity,
    message,
    dependentOn,
    info,
    link
  } = responseData;

  if (
    !validate(
      name,
      healthy,
      actionable,
      type,
      severity,
      message,
      dependentOn,
      info,
      link
    )
  ) {
    throw new InvalidHealthcheckResponse(
      "Invalid input for HealthCheckResponse",
      responseData
    );
  }

  return createResponse(responseData);
};
