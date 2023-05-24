"use strict";
const R = require("ramda");
const { validate } = require("spected");

const types = require("../constants/types");
const severities = require("../constants/severities");

const DEPENDENT_ON_REQUIRED_TYPES = [
  types.INFRASTRUCTURE,
  types.INTERNAL_DEPENDENCY,
  types.EXTERNAL_DEPENDENCY
];

const notEmpty = R.compose(
  R.not,
  R.isEmpty
);
const notNil = R.compose(
  R.not,
  R.isNil
);
const isString = R.is(String);
const isBoolean = R.is(Boolean);
const isObject = R.is(Object);
const oneOf = collection => R.curry(R.includes)(R.__, R.keys(collection));

const createSuffix = healthy =>
  `when healthcheck is ${healthy ? "healthy" : "unhealthy"}`;
const SUFFIX_HEALTHY_MSG = createSuffix(true);
const SUFFIX_UNHEALTHY_MSG = createSuffix(false);

const healthyCheckMessage = msg => `${msg} ${SUFFIX_HEALTHY_MSG}`;
const unhealthyCheckMessage = msg => `${msg} ${SUFFIX_UNHEALTHY_MSG}`;

const commonRules = input => ({
  healthy: [[isBoolean, "Healthy should be a boolean"]],
  info: [[R.either(R.isNil, isObject), "Info should be an object"]],
  dependentOn: R.includes(input.type, DEPENDENT_ON_REQUIRED_TYPES)
    ? [
        [isString, "DependentOn should be a string"],
        [
          notEmpty,
          `DependentOn is required when type is one of ${DEPENDENT_ON_REQUIRED_TYPES.join(
            ", "
          )}`
        ]
      ]
    : [
        [
          R.isNil,
          `DependentOn should be omitted when type is one of ${R.values(
            R.omit(DEPENDENT_ON_REQUIRED_TYPES, types)
          ).join(", ")}`
        ]
      ]
});

const healthyRules = input => ({
  name: [
    [isString, healthyCheckMessage("Name should be a string")],
    [notEmpty, healthyCheckMessage("Name should not be empty")]
  ],
  type: [
    [
      oneOf(types),
      healthyCheckMessage(`Type should be one of ${R.keys(types).join(", ")}`)
    ]
  ],
  actionable: [
    [isBoolean, healthyCheckMessage("Actionable should be a boolean")]
  ],
  severity: [[R.isNil, healthyCheckMessage("Severity should be omitted")]]
});

const unhealthyRules = input => ({
  severity: [
    [notNil, unhealthyCheckMessage("Severity is required")],
    [
      oneOf(severities),
      unhealthyCheckMessage(
        `Severity should be one of ${R.keys(severities).join(", ")}`
      )
    ]
  ],
  message: [
    [isString, unhealthyCheckMessage("Message should be a string")],
    [notEmpty, unhealthyCheckMessage("Message is required")]
  ]
});

const rules = input =>
  Object.assign(
    commonRules(input),
    R.ifElse(({ healthy }) => healthy === true, healthyRules, unhealthyRules)(
      input
    )
  );

const validator = R.curry(validate(() => true, R.head));

module.exports = input => validator(rules(input))(input);
