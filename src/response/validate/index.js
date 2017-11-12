"use strict";
const { head, curry } = require("ramda");
const { validate } = require("spected");

const onSuccess = () => true;
const onError = head;
const validator = curry(validate(onSuccess, onError));
const rules = require("./rules");

module.exports = input => validator(rules(input))(input);
