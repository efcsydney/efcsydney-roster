const log = require('../utilities/logger');
const config = require('config');
/*
  http://expressjs.com/en/guide/error-handling.html
*/
const httpRedirect = function(req, res, next) {
  log.debug(`Incoming port number ${req.socket.localPort}`);
  const securePort = config.get('port.secure');
  if (req.socket.localPort == securePort) {
    // request was via https, so do no special handling
    log.debug('secure channel - pass through');
    next();
  } else {
    const redirectUrl = `https://${req.headers.host}${req.url}`;
    log.debug(`Redirect to ${redirectUrl}`);
    // request was via http, so redirect to https
    res.redirect(redirectUrl);
  }
};

module.exports = httpRedirect;