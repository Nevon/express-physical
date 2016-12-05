# Express Physical
[![Build Status](https://travis-ci.org/Nevon/express-physical.svg?branch=master)](https://travis-ci.org/Nevon/express-physical)

Healthcheck middleware for Express.

## Purpose

`express-physical` is intended to be more or less a port of [physical](https://github.com/alde/physical). The intention is to have Dropwizard-style healthchecks for Node.

## Installation

```shell
npm install --save express-physical
# or
yarn add express-physical
```

## Usage

```javascript
const express = require('express')
const physical = require('express-physical')

const app = express()

const passingCheck = () => physical.response({
  name: 'Sample passing check',
  actionable: false,
  healthy: true,
  type: physical.type.SELF
})

app.use('/healthcheck', physical([passingCheck]))
```

## API

```javascript
const physical = require('express-physical')
```

The `physical` function expects an array of `Check`s and returns a middleware.

### `physical([Check])`

Returns a middleware that returns an object with the currently healthy and unhealthy checks:

```
const middleware = physical([alwaysPassing, alwaysFailing])

// Will send a 200 OK with the following payload:

{
  "healthy": [{
    "name": "Always passing",
    "actionable": false,
    "type": "SELF",
    "healthy": true
  }],
  "unhealthy": [{
    "name": "Always failing",
    "actionable": false,
    "type": "SELF",
    "healthy": false,
    "message": "What can you do...?",
    "severity": "WARN"
  }]
}
```

### Check(fn)

`Check` is not a class provided by `physical`, it is simply a function with one of two forms:

```javascript
//Synchronous check
const synchronousCheck = function () {
  return physical.response(...)
}

// Async Check
const asyncCheck = function (done) {
  done(physical.response(...))
}
```

The check must always return or call the callback with a `physical.response`.

If the check throws an error, it will be forwarded to the next middleware where it has to be handled by the application. It will **not** be caught by the `physical` middleware and treated as a failing check.

### `physical.response({ options })`

| Option | Description | Mandatory |
| --- | --- | --- |
| `name` string | A descriptive name | Yes |
| `healthy` boolean | | Yes |
| `type` physical.type | The type of this check | Yes |
| `severity` physical.severity | | When the check is unhealthy |
| `actionable` boolean | Whether or not the owner can act on this check failing | Yes |
| `message` string | | When the check is unhealthy |
| `dependentOn` string | The name of a service that this check relies on | When the `type` is one of `INFRASTRUCTURE`, `INTERNAL_DEPENDENCY` and `EXTERNAL_DEPENDENCY`. Excluded otherwise.
| `info` string{} | Object of any depth with additional info about this check | No |
| `link` string | A URL to where more information can be found | No

### `physical.type`

Constants representing the type of a check.

* `SELF`
* `METRICS`
* `INFRASTRUCTURE`
* `INTERNAL_DEPENDENCY`
* `EXTERNAL_DEPENDENCY`
* `INTERNET_CONNECTIVITY`

### `physical.severity`

Constants representing the severity of a failing check.

* `WARNING`
* `CRITICAL`
* `DOWN`

## Prior art

* [express-healthcheck](https://www.npmjs.com/package/express-healthcheck) - A little _too_ simple for my use case, where I can have multiple independently failing checks where I want to provide data regarding all of them. `express-physical` could be implemented within `express-healthcheck`, but I'm looking for something a little more structured.
* [node-healthchecks](https://github.com/broadly/node-healthchecks) - Checks the system by trying to request public resources, but couldn't, for example, tell you if you're unable to connect to the database.
* Heavily inspired by [physical](https://github.com/alde/physical). The API contract is essentially the same.

## Tips

### Avoiding repeating data for `responses`

Use a higher-order function to avoid having to repeat certain elements when creating `responses`. Ex.

```javascript
const physical = require('express-physical')

const createDatabaseHealthCheck = (data) => (db) => (done) => {
  if (db.connection.readyState === 1) {
    done(Object.assign({}, data, physical.response({
      healthy: true,
      actionable: false
    })))
  } else {
    done(Object.assign({}, data, physical.response({
      healthy: false,
      actionable: true,
      severity: physical.severity.CRITICAL,
      message: 'Failed to connect to db'
    })))
  }
}

const canConnectToDatabase = ({
  name: 'Database connection',
  type: physical.type.INTERNAL_DEPENDENCY,
  dependentOn: {
    serviceName: 'mongodb'
  }
})(db)

app.use('/healthcheck', physical([canConnectToDatabase]))
```
