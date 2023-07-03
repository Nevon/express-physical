"use strict";
const R = require("ramda");
const { isValidationErrorLike } = require("zod-validation-error");

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

module.exports = function(responseData) {
  const validatable = Object.assign({}, RESPONSE_FORMAT, responseData);
  try {
    validate(validatable);
  } catch (error) {
    if (!isValidationErrorLike(error)) {
      throw error;
    }

    throw new InvalidHealthcheckResponse(error.message, responseData);
  }

  return createResponse(responseData);
};
