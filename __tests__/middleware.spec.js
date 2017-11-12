"use strict";
const physical = require("../src/physical");

describe("factory", () => {
  test("it should return a function", () => {
    expect(physical()).toBeInstanceOf(Function);
  });
});

describe("When there is an error thrown", () => {
  test("should forward the error to the next middleware", () => {
    const next = jest.fn();
    const error = new Error("Boom");
    const check = () => {
      throw error;
    };
    const middleware = physical([check]);

    middleware({}, {}, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});

describe("When the checks complete", () => {
  describe("With healthy checks", () => {
    test("It sends the serialized responses with 200 status code", () => {
      const statusMock = jest.fn();
      const res = {
        json: jest.fn(),
        status: statusMock
      };
      statusMock.mockReturnValue(res);

      const check = () => {
        return physical.response({
          name: "Test",
          healthy: true,
          type: physical.type.SELF,
          actionable: false
        });
      };

      physical([check])({}, res, () => {});

      expect(res.json).toHaveBeenCalledWith({
        healthy: [
          {
            name: "Test",
            healthy: true,
            type: "SELF",
            actionable: false
          }
        ],
        unhealthy: []
      });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("With unhealthy checks", () => {
    test("It sends the serialized responses with 500 status code", () => {
      const statusMock = jest.fn();
      const res = {
        json: jest.fn(),
        status: statusMock
      };
      statusMock.mockReturnValue(res);

      const check = () => {
        return physical.response({
          name: "Failing Test",
          healthy: false,
          type: physical.type.SELF,
          actionable: false,
          severity: physical.severity.WARNING,
          message: "Something is failing"
        });
      };

      physical([check])({}, res, () => {});

      expect(res.json).toHaveBeenCalledWith({
        healthy: [],
        unhealthy: [
          {
            name: "Failing Test",
            healthy: false,
            type: "SELF",
            actionable: false,
            severity: "WARNING",
            message: "Something is failing"
          }
        ]
      });
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
