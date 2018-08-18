function toString(expressValidatorError) {
  return expressValidatorError
    .array()
    .map(error => error.msg)
    .join(',');
}

module.exports = toString;
