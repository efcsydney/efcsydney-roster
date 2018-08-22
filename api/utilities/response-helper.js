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

function validationFail(validationError) {
  return {
    result: 'FAIL',
    error: validationError.array()
  };
}

module.exports = {
  ok,
  fail,
  validationFail
};
