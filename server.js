process.env.TZ = 'Australia/Sydney';

const env = process.env.NODE_ENV;
if (env === 'production' || env === 'qa') {
  if (env === 'qa') {
    process.env.NEW_RELIC_HOME = __dirname + '/newrelic.qa.js';
  }
  require('newrelic');
}

const app = require('./app').app;
const logger = require('winston');

app.listen(app.get('port'), () => {
  logger.info(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
