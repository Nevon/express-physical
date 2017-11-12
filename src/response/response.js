"use strict";
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

const addEmptyFields = data => Object.assign({}, RESPONSE_FORMAT, data);

const createResponse = responseData =>
  R.pick(Object.keys(RESPONSE_FORMAT), responseData);

const someFail = R.compose(R.not, R.all(R.equals(true)));
const isMessage = R.compose(R.not, R.is(Boolean));
const firstMessage = R.compose(R.head, R.filter(isMessage), R.values);

module.exports = function(responseData) {
  const validationResult = validate(addEmptyFields(responseData));

  if (someFail(Object.values(validationResult))) {
    throw new InvalidHealthcheckResponse(
      firstMessage(validationResult),
      responseData
    );
  }

  return createResponse(responseData);
};
