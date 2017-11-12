"use strict";
const R = require("ramda");
const { parallel } = require("neo-async");
const wrapWithCallbackIfNeeded = require("./lib/wrap-with-callback");

const toParallel = check => cb => {
  try {
    return check(res => cb(undefined, res));
  } catch (e) {
    return cb(e);
  }
};

module.exports = checks =>
  R.curry(parallel)(
    checks.map(R.compose(toParallel, wrapWithCallbackIfNeeded))
  );
