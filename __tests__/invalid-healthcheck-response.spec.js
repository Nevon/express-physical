"use strict";
const InvalidHealthCheckResponse = require("../src/response/invalid-healthcheck-response");

describe("InvalidHealthCheckResponse", () => {
  it("should contain the responseData as a custom field", () => {
    const responseData = { foo: "bar" };
    expect(
      new InvalidHealthCheckResponse("message", responseData).responseData
    ).toEqual(responseData);
  });
});
