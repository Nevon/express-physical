const R = require("ramda");

const response = require("../src/response/response");
const serialize = require("../src/response/serialize");
const InvalidHealthcheckResponse = require("../src/response/invalid-healthcheck-response");
const { types, severities } = require("../src/constants");

const baseResponse = {
  name: "Name",
  actionable: true,
  type: types.SELF,
  info: { foo: "bar" },
  link: "http://google.com"
};

const healthyResponse = Object.assign({}, baseResponse, {
  healthy: true
});

const unhealthyResponse = Object.assign({}, baseResponse, {
  healthy: false,
  severity: severities.CRITICAL,
  message: "Message"
});

describe("Response", () => {
  describe("Validation", () => {
    const requiredFields = ["name", "actionable", "type"];

    requiredFields.forEach(field => {
      test(`It should throw an error when ${field} is missing`, () => {
        expect(() => response(R.omit([field], healthyResponse)));
      });
    });

    describe("When the check is healthy", () => {
      test("It should throw an error if severity is provided", () => {
        expect(() =>
          response(
            Object.assign({}, healthyResponse, { severity: severities.WARNING })
          )
        ).toThrow(InvalidHealthcheckResponse);
      });
    });

    describe("When the result is unhealthy", () => {
      const requiredFieldsWhenUnhealthy = ["severity", "message"];

      requiredFieldsWhenUnhealthy.forEach(field => {
        test(`It should throw an error when ${field} is missing`, () => {
          expect(() => response(R.omit([field], unhealthyResponse))).toThrow(
            InvalidHealthcheckResponse
          );
        });
      });
    });

    const dependentOnRequiredForTypes = [
      types.INFRASTRUCTURE,
      types.INTERNAL_DEPENDENCY,
      types.EXTERNAL_DEPENDENCY
    ];
    describe("dependentOn is required for type", () => {
      dependentOnRequiredForTypes.forEach(type => {
        test(type, () => {
          expect(() =>
            response(Object.assign({}, unhealthyResponse, { type }))
          ).toThrow(InvalidHealthcheckResponse);
        });
      });
    });

    describe("dependentOn should not be present for type", () => {
      R.keys(R.omit(dependentOnRequiredForTypes, types)).forEach(type => {
        test(type, () => {
          expect(() =>
            response(
              Object.assign({}, healthyResponse, { dependentOn: "foobar" })
            )
          ).toThrow(InvalidHealthcheckResponse);
        });
      });
    });
  });

  describe("serialization", () => {
    const serializeResponse = R.compose(serialize, response);

    test("should format dependentOn as an object", () => {
      const actual = serializeResponse(
        Object.assign({}, unhealthyResponse, {
          type: types.INFRASTRUCTURE,
          dependentOn: "foo"
        })
      );
      const expected = {};
      expected["service_name"] = "foo";

      expect(actual["dependent_on"]).toEqual(expected);
    });

    test("should remove empty fields", () => {
      const fields = R.keys(
        serializeResponse(
          Object.assign({}, unhealthyResponse, { info: undefined, link: "" })
        )
      );

      expect(fields.includes("info")).toBe(false);
      expect(fields.includes("link")).toBe(false);
    });
  });
});
