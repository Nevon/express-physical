const ensureCallback = require('../../src/lib/ensure-callback')

describe('When called on a function that does not take a callback', () => {
  test('should wrap it with a function that takes a callback', () => {
    const fn = ensureCallback(() => 1)
    const stub = jest.fn()

    fn(stub)

    expect(stub).toHaveBeenCalledWith(1)
  })
})

describe('When called on a function that already takes a callback', () => {
  test('should not wrap it', () => {
    const fn = ensureCallback((cb) => cb(1))
    const stub = jest.fn()

    fn(stub)

    expect(stub).toHaveBeenCalledWith(1)
  })
})
