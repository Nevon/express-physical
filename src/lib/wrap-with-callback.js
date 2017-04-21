module.exports = fn => {
  if (fn.length === 0) {
    return cb => cb(fn());
  }

  return fn;
};
