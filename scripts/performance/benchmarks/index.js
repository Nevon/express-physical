"use strict";
const Benchmark = require("benchmark");
const bb = require("beautify-benchmark");
const request = require("supertest");
const express = require("express");

const versions = [
  {
    label: "latest",
    module: require("express-physical"),
    marshal: require("express-physical/src/marshal")
  },
  {
    label: "local",
    module: require("../head"),
    marshal: require("../head/src/marshal")
  }
];

const benchmarks = [];

const setupBenchmarks = () => {
  initBenchmarkForHealthyResponse();
  initBenchmarkForUnhealthyResponse();
  initBenchmarkForCheckEvaluation();
  initBenchmarkForMarshalling();

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

const initBenchmarkForMarshalling = () => {
  const input = [
    {
      name: "Failing Test",
      healthy: false,
      actionable: false,
      type: "SELF",
      severity: "WARNING",
      message: "Something is failing"
    }
  ];

  const suite = createSuite();
  versions.forEach(version => {
    const marshal = version.marshal;
    suite.add(`[${version.label}] | Marshal results`, () => {
      marshal(input);
    });
  });
  benchmarks.push(suite);
};

const initBenchmarkForCheckEvaluation = () => {
  const suite = createSuite();
  versions.forEach(version => {
    const physical = version.module;
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

    const app = express();
    const path = "/health";
    app.use(path, physical([passingCheck, failingCheck]));

    suite.add(`[${version.label}] | Call healthcheck endpoint`, {
      defer: true,
      fn: deferred => {
        return request(app)
          .get(path)
          .expect(500)
          .then(response => {
            deferred.resolve();
          })
          .catch(e => {
            console.error(e);
            deferred.reject();
          });
      }
    });
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
