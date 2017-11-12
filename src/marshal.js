"use strict";
const R = require("ramda");

const serialize = require("./response/serialize");

const HEALTHY_KEY = "healthy";
const UNHEALTHY_KEY = "unhealthy";

const healthy = ({ healthy }) => (healthy ? HEALTHY_KEY : UNHEALTHY_KEY);
const byHealth = R.groupBy(healthy);
const serializeAll = R.map(serialize);
const addRequiredEmptyGroups = response =>
  Object.assign(
    {
      [HEALTHY_KEY]: [],
      [UNHEALTHY_KEY]: []
    },
    response
  );

module.exports = R.compose(addRequiredEmptyGroups, byHealth, serializeAll);
