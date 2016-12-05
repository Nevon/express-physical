const physical = require('../src/physical')

describe('factory', () => {
  test('it should return a function', () => {
    expect(physical()).toBeInstanceOf(Function)
  })
})

describe('When there is an error thrown', () => {
  test('should forward the error to the next middleware', () => {
    const next = jest.fn()
    const error = new Error('Boom')
    const check = () => {
      throw error
    }
    const middleware = physical([check])

    middleware({}, {}, next)

    expect(next).toHaveBeenCalledWith(error)
  })
})

describe('When the checks complete', () => {
  test('It sends the serialized responses', () => {
    const res = {
      send: jest.fn(),
      status: function () {
        return this
      }
    }

    const check = () => {
      return physical.response({
        name: 'Test',
        healthy: true,
        type: physical.type.SELF,
        actionable: false
      })
    }

    physical([check])({}, res, () => {})

    expect(res.send).toHaveBeenCalledWith({
      healthy: [{
        name: 'Test',
        healthy: true,
        type: 'SELF',
        actionable: false
      }]
    })
  })
})
