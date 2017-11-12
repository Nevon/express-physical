const express = require("express");

const physical = require("../..");

module.exports = () => {
  const app = express();

  const passingCheck = () =>
    physical.response({
      name: "Sample passing check",
      actionable: false,
      healthy: true,
      type: physical.type.SELF
    });

  const failingCheck = () =>
    physical.response({
      name: "Sample passing check",
      actionable: false,
      healthy: false,
      severity: physical.severity.WARNING,
      message: "Something failed",
      type: physical.type.SELF
    });

  const path = "/healthcheck";
  app.use("/passing", physical([passingCheck]));
  app.use("/failing", physical([failingCheck]));

  return app;
};
