const physical = require('../index')

describe('Entrypoint', () => {
  test('it should return a function', () => {
    expect(physical()).toBeInstanceOf(Function)
  })

  describe('Middleware', () => {
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
  })
})
