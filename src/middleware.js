"use strict";
const runner = require("./runner");
const marshal = require("./marshal");

module.exports = (checks = []) => {
  const runChecks = runner(checks);

  return (req, res, next) =>
    runChecks((err, result) =>
      err ? next(err) : res.status(200).json(marshal(result))
    );
};
