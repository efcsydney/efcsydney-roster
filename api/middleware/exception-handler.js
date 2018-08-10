const log = require('../utilities/logger');
const ValidationError = require('../models-validator/validation-error');
/*
  http://expressjs.com/en/guide/error-handling.html
*/
const errorHandler = function(err, req, res, next) {
  log.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }
  const response = errorBuilder(err);
  res.status(response.statusCode);
  res.send(response.error);
};

const errorBuilder = function(err) {
  return err instanceof ValidationError
    ? validationErrorBuilder(err)
    : serverErrorBuilder(err);
};

const validationErrorBuilder = function(validationError) {
  return {
    statusCode: 400,
    error: { message: validationError.errors.join(',') }
  };
};

const serverErrorBuilder = function(err) {
  return { statusCode: 500, error: { message: err.message } };
};

module.exports = { errorHandler };
