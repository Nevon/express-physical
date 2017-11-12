"use strict";
const R = require("ramda");

const { isString, notEmpty } = require("./utils");
const types = require("../../../constants/types");

const DEPENDENT_ON_REQUIRED_TYPES = [
  types.INFRASTRUCTURE,
  types.INTERNAL_DEPENDENCY,
  types.EXTERNAL_DEPENDENCY
];

const EMPTY_MESSAGE = `DependentOn is required when type is one of ${DEPENDENT_ON_REQUIRED_TYPES.join(
  ", "
)}`;
const NOT_NIL_MESSAGE = `DependentOn should be omitted when type is one of ${R.values(
  R.omit(DEPENDENT_ON_REQUIRED_TYPES, types)
).join(", ")}`;

module.exports = ({ type }) =>
  R.contains(type, DEPENDENT_ON_REQUIRED_TYPES)
    ? [[isString, "DependentOn should be a string"], [notEmpty, EMPTY_MESSAGE]]
    : [[R.isNil, NOT_NIL_MESSAGE]];
