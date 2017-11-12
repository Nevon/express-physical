"use strict";
const { curry, compose } = require("ramda");
const { parallel } = require("neo-async");
const wrapWithCallbackIfNeeded = require("./lib/wrap-with-callback");

const toParallel = check => cb => {
  try {
    return check(res => cb(undefined, res));
  } catch (e) {
    return cb(e);
  }
};

const curriedParallel = curry(parallel);
const toParallelAsync = compose(toParallel, wrapWithCallbackIfNeeded);

module.exports = checks => curriedParallel(checks.map(toParallelAsync));
