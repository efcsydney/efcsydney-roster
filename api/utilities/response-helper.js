function ok(data) {
  return {
    result: 'OK',
    error: { message: '' },
    data
  };
}

function fail(message) {
  return {
    result: 'FAIL',
    error: { message }
  };
}

module.exports = {
  ok,
  fail
};
