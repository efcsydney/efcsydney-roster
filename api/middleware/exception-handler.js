const log = require('../utilities/logger');
/*
  http://expressjs.com/en/guide/error-handling.html
*/
const errorHandler = function(err, req, res, next) {
  log.error(err.stack);

  if (res.headersSent) {
    return next(err);
  }

  res.status(500);
  res.send({ message: err.message });
};

module.exports = { errorHandler };
