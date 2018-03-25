const { Server, createServer } = require('http')
const express = require('express');
const url = require('url');
const logger = require('./api/utilities/logger');
const { INSECURE_PORT, WEB_DEV_PORT } = require('./app-config');

class InsecurePort {
  constructor() {
    // initialize the new express instance
    this.app = express();

    this.app.set('port', process.env.PORT || WEB_DEV_PORT);
    // pass this express instance to the http server
    this.server = createServer(this.app);

    // instantiate routes
    this.routes();
  }

  routes() {
    const securePort = this.app.get('port');
    // tell the express instance to run this callback for each request
    this.app.use((req, res, next) => {
      // check if it is a secure (https) request
      // if not redirect to the equivalent https url

      const originalUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      const parser = url.parse(originalUrl);
      const redirectUrl = `${parser.protocol}//${parser.hostname}:${securePort}${req.originalUrl}`;
      logger.info(`Redirect from ${originalUrl} to ${redirectUrl}`);
      res.redirect(redirectUrl);
    });
  }

  listen() {
    // tell express instance to listen on given port
    this.server.listen(INSECURE_PORT);
  }
}

module.exports = { InsecurePort };
