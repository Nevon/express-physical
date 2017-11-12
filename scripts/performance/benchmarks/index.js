"use strict";
const Benchmark = require("benchmark");
const bb = require("beautify-benchmark");

const versions = [
  {
    label: "latest",
    module: require("express-physical")
  },
  {
    label: "local",
    module: require("../head")
  }
];

const benchmarks = [];

const setupBenchmarks = () => {
  initBenchmarkForHealthyResponse();
  initBenchmarkForUnhealthyResponse();

  runNextTest();
};

const createSuite = () =>
  new Benchmark.Suite()
    .on("cycle", event => {
      if (event.target.error) {
        event.target.error = {
          stack: event.target.error.stack
        };
      }
      bb.add(event.target);
    })
    .on("complete", () => {
      bb.log();
      runNextTest();
    });

const runNextTest = () => {
  if (benchmarks.length) {
    benchmarks.pop().run({ async: true });
  } else {
    console.log("All tests complete");
  }
};

const initBenchmarkForHealthyResponse = () => {
  const suite = createSuite();
  versions.forEach(version => {
    const physical = version.module;
    suite.add(`[${version.label}] | Create response | Healthy`, () =>
      physical.response(healthyResponse(physical))
    );
  });
  benchmarks.push(suite);
};

const initBenchmarkForUnhealthyResponse = () => {
  const suite = createSuite();
  versions.forEach(version => {
    const physical = version.module;
    suite.add(`[${version.label}] | Create response | Unhealthy`, () =>
      physical.response(unhealthyResponse(physical))
    );
  });
  benchmarks.push(suite);
};

const baseResponse = physical => ({
  name: "Name",
  actionable: true,
  type: physical.type.SELF,
  info: { foo: "bar" },
  link: "http://google.com"
});

const healthyResponse = physical =>
  Object.assign({}, baseResponse(physical), {
    healthy: true
  });

const unhealthyResponse = physical =>
  Object.assign({}, baseResponse(physical), {
    healthy: false,
    severity: physical.severity.CRITICAL,
    message: "Message"
  });

setupBenchmarks();
