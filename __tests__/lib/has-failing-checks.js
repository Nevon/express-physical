"use strict";
const hasFailingChecks = require("../../src/lib/has-failing-checks");

const baseResponse = {
  name: "Name",
  actionable: true,
  type: "SELF",
  info: { foo: "bar" },
  link: "http://google.com"
};

const healthyResponse = Object.assign({}, baseResponse, {
  healthy: true
});

const unhealthyResponse = Object.assign({}, baseResponse, {
  healthy: false,
  severity: "CRITICAL",
  message: "Message"
});

describe("When at least one check is unhealthy", () => {
  test("It returns true", () => {
    expect(hasFailingChecks([healthyResponse, unhealthyResponse])).toBe(true);
  });
});

describe("When all checks are healthy", () => {
  test("It returns false", () => {
    expect(hasFailingChecks([healthyResponse])).toBe(false);
  });
});

describe("When there are no checks", () => {
  test("It returns false", () => {
    expect(hasFailingChecks()).toBe(false);
  });
});
