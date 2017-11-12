"use strict";
const { compose, not, all, equals, is, head, filter, pick } = require("ramda");

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
  pick(Object.keys(RESPONSE_FORMAT), responseData);

const someFail = compose(not, all(equals(true)));
const isMessage = compose(not, is(Boolean));
const firstMessage = compose(head, filter(isMessage), Object.values);

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
