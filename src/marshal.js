"use strict";
const { compose, groupBy, map } = require("ramda");

const serialize = require("./response/serialize");

const HEALTHY_KEY = "healthy";
const UNHEALTHY_KEY = "unhealthy";

const healthy = ({ healthy }) => (healthy ? HEALTHY_KEY : UNHEALTHY_KEY);
const byHealth = groupBy(healthy);
const serializeAll = map(serialize);
const addRequiredEmptyGroups = response =>
  Object.assign(
    {
      [HEALTHY_KEY]: [],
      [UNHEALTHY_KEY]: []
    },
    response
  );

module.exports = compose(addRequiredEmptyGroups, byHealth, serializeAll);
