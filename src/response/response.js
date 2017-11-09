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
  if (
    !validate(
      responseData.name,
      responseData.healthy,
      responseData.actionable,
      responseData.type,
      responseData.severity,
      responseData.message,
      responseData.dependentOn,
      responseData.info,
      responseData.link
    )
  ) {
    throw new InvalidHealthcheckResponse(
      "Invalid input for HealthCheckResponse",
      responseData
    );
  }

  return createResponse(responseData);
};
