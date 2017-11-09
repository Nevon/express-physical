module.exports = class InvalidHealthcheckResponse extends Error {
  constructor(message, responseData, ...args) {
    super([message, ...args]);
    this.responseData = responseData;
    Error.captureStackTrace(this, InvalidHealthcheckResponse);
  }
};
