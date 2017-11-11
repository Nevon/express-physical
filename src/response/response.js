const R = require("ramda");

const InvalidHealthcheckResponse = require("./invalid-healthcheck-response");
const validate = require("./validate");

const RESPONSE_FORMAT = {
  name: undefined,
  healthy: undefined,
  actionable: undefined,
  type: undefined,
  severity: undefined,
  message: undefined,
  dependentOn: undefined,
  info: undefined,
  link: undefined
};

const createResponse = responseData =>
  R.pick(Object.keys(RESPONSE_FORMAT), responseData);

const someFail = results =>
  R.not(R.all(R.equals(true), Object.values(results)));

const isMessage = R.compose(R.not, R.is(Boolean));
const firstMessage = R.compose(R.head, R.filter(isMessage), R.values);

module.exports = function(responseData) {
  const validatable = Object.assign({}, RESPONSE_FORMAT, responseData);
  const validationResult = validate(validatable);

  if (someFail(validationResult)) {
    throw new InvalidHealthcheckResponse(
      firstMessage(validationResult),
      responseData
    );
  }

  return createResponse(responseData);
};
