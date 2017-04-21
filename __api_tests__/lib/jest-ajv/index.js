const matcherUsing = require('./matcher')

module.exports = (ajv) => expect.extend({
  toMatchSchema: matcherUsing(ajv)
})
