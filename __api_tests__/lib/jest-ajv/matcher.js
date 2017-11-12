"use strict";
module.exports = ajv => (response, schema) => {
  const pass = ajv.validate(schema, response);

  if (pass) {
    return {
      pass,
      message: () => `All properties should not match`
    };
  } else {
    return {
      pass,
      message: () => `\n${ajv.errorsText(ajv.errors, { separator: "\n" })}\n`
    };
  }
};
