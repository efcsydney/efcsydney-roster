process.env.TZ = 'Australia/Sydney';
const app = require('./app').app;
const logger = require('winston');
const Raven = require('raven');
const env = process.env.NODE_ENV;

if (env === 'qa' || env === 'production') {
  Raven.config(
    'https://6d4d9e488cda4ef59dddc1e282a24a7b:7b89fb0393e54e55aea1d72c3e968223@sentry.io/263713',
    { environment: env }
  ).install();
}

app.listen(app.get('port'), () => {
  logger.info(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
