const R = require("ramda");

const serialize = require("./response/serialize");

const byHealth = R.groupBy(
  response => (response.healthy ? "healthy" : "unhealthy")
);
const serializeAll = R.curry(R.map)(serialize);
const addRequiredEmptyGroups = response =>
  Object.assign(
    {
      healthy: [],
      unhealthy: []
    },
    response
  );

module.exports = R.compose(addRequiredEmptyGroups, byHealth, serializeAll);
