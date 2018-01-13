process.env.TZ = 'Australia/Sydney';

if (process.env.NODE_ENV === 'qa') {
  require('newrelic');
}

const app = require('./app').app;
const logger = require('winston');

app.listen(app.get('port'), () => {
  logger.info(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
