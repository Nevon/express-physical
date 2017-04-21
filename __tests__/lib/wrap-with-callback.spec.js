const wrapWithCallbackIfNeeded = require("../../src/lib/wrap-with-callback");

describe("When called on a function that does not take a callback", () => {
  test("should wrap it with a function that takes a callback", () => {
    const fn = wrapWithCallbackIfNeeded(() => 1);
    const stub = jest.fn();

    fn(stub);

    expect(stub).toHaveBeenCalledWith(1);
  });
});

describe("When called on a function that already takes a callback", () => {
  test("should not wrap it", () => {
    const fn = wrapWithCallbackIfNeeded(cb => cb(1));
    const stub = jest.fn();

    fn(stub);

    expect(stub).toHaveBeenCalledWith(1);
  });
});
