const Ajv = require("ajv");
const request = require("supertest");
const express = require("express");
const physical = require("../index");

const schema = require("./resources/schema");

const ajv = new Ajv();
ajv.addSchema(schema, "schema.json");
require("./lib/jest-ajv")(ajv);

const path = "/healthcheck";

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

describe("When the healthchecks are passing", () => {
  const app = express();

  app.use(path, physical([passingCheck]));

  test("The schema should be valid", () => {
    return request(app)
      .get(path)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then(response => {
        expect(response.body).toMatchSchema({
          $ref: "schema.json#/definitions/ServiceInstanceHealthDto"
        });
      });
  });
});

describe("When the healthchecks are all failing", () => {
  const app = express();

  app.use(path, physical([failingCheck]));

  test("The schema should be valid", () => {
    return request(app)
      .get(path)
      .expect(500)
      .expect("Content-Type", /application\/json/)
      .then(response => {
        expect(response.body).toMatchSchema({
          $ref: "schema.json#/definitions/ServiceInstanceHealthDto"
        });
      });
  });
});

describe("When some of the checks are failing", () => {
  const app = express();

  app.use(path, physical([passingCheck, failingCheck]));

  test("The schema should be valid", () => {
    return request(app)
      .get(path)
      .expect(500)
      .expect("Content-Type", /application\/json/)
      .then(response => {
        expect(response.body).toMatchSchema({
          $ref: "schema.json#/definitions/ServiceInstanceHealthDto"
        });
      });
  });
});

describe("When there are no healthchecks", () => {
  const app = express();

  app.use(path, physical([]));

  test("The schema should be valid", () => {
    return request(app)
      .get(path)
      .expect(200)
      .expect("Content-Type", /application\/json/)
      .then(response => {
        expect(response.body).toMatchSchema({
          $ref: "schema.json#/definitions/ServiceInstanceHealthDto"
        });
      });
  });
});
