"use strict";
const R = require("ramda");
const { z } = require("zod");
const { fromZodError } = require("zod-validation-error");

const types = require("../constants/types");
const severities = require("../constants/severities");

const DEPENDENT_ON_REQUIRED_TYPES = [
  types.INFRASTRUCTURE,
  types.INTERNAL_DEPENDENCY,
  types.EXTERNAL_DEPENDENCY
];

const createSuffix = healthy =>
  `when healthcheck is ${healthy ? "healthy" : "unhealthy"}`;
const SUFFIX_HEALTHY_MSG = createSuffix(true);
const SUFFIX_UNHEALTHY_MSG = createSuffix(false);

const healthyCheckMessage = msg => `${msg} ${SUFFIX_HEALTHY_MSG}`;
const unhealthyCheckMessage = msg => `${msg} ${SUFFIX_UNHEALTHY_MSG}`;

const commonRules = input =>
  z.object({
    healthy: z.boolean({
      required_error: "Healthy is required",
      invalid_type_error: "Healthy should be a boolean"
    }),
    info: z
      .record(z.any(), {
        invalid_type_error: "Info should be an object"
      })
      .optional(),
    dependentOn: R.includes(input.type, DEPENDENT_ON_REQUIRED_TYPES)
      ? z
          .string({
            required_error: `DependentOn is required when type is one of ${DEPENDENT_ON_REQUIRED_TYPES.join(
              ", "
            )}`,
            invalid_type_error: "DependentOn should be a string"
          })
          .nonempty(
            `DependentOn is required when type is one of ${DEPENDENT_ON_REQUIRED_TYPES.join(
              ", "
            )}`
          )
      : z
          .undefined({
            invalid_type_error: `DependentOn should be omitted when type is one of ${R.values(
              R.omit(DEPENDENT_ON_REQUIRED_TYPES, types)
            ).join(", ")}`
          })
          .nullable()
  });

const healthyRules = z.object({
  name: z
    .string({
      required_error: healthyCheckMessage("Name is required"),
      invalid_type_error: healthyCheckMessage("Name should be a string")
    })
    .nonempty(healthyCheckMessage("Name should not be empty")),
  type: z.enum(R.values(types), {
    required_error: healthyCheckMessage("Type is required"),
    invalid_type_error: healthyCheckMessage(
      `Type should be one of ${R.keys(types).join(", ")}`
    )
  }),
  actionable: z.boolean({
    required_error: healthyCheckMessage("Actionable is required"),
    invalid_type_error: healthyCheckMessage("Actionable should be a boolean")
  }),
  severity: z
    .undefined({
      invalid_type_error: healthyCheckMessage("Severity should be omitted")
    })
    .optional()
});

const unhealthyRules = z.object({
  severity: z.enum(R.values(severities), {
    required_error: unhealthyCheckMessage("Severity is required"),
    invalid_type_error: unhealthyCheckMessage(
      `Severity should be one of ${R.keys(severities).join(", ")}`
    )
  }),
  message: z.string({
    required_error: unhealthyCheckMessage("Message is required"),
    invalid_type_error: unhealthyCheckMessage("Message should be a string")
  })
});

const rules = input => {
  return commonRules(input).merge(
    input.healthy === true ? healthyRules : unhealthyRules
  );
};

module.exports = input => {
  try {
    return rules(input).parse(input);
  } catch (error) {
    throw fromZodError(error, { prefix: "", prefixSeparator: "" });
  }
};
