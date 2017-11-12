"use strict";
const runner = require("./runner");
const marshal = require("./marshal");
const hasFailingChecks = require("./lib/has-failing-checks");

module.exports = (checks = []) => {
  const runChecks = runner(checks);

  return (req, res, next) =>
    runChecks(
      (err, result) =>
        err
          ? next(err)
          : res
              .status(hasFailingChecks(result) ? 500 : 200)
              .json(marshal(result))
    );
};
