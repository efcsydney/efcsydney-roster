const express = require('express');
app = express();
module.exports.app = app;
const { API_DEV_PORT } = require('./app-config');
const bodyParser = require('body-parser');
const eventsController = require('./api/controllers/events-controller');
const servicesController = require('./api/controllers/services-controller');
const exception = require('./api/middleware/exception-handler');
const serviceInfoController = require('./api/controllers/service-info-controller');
const Raven = require('raven');
const env = process.env.NODE_ENV;

if (isServerEnvironment()) {
  Raven.config(
    'https://6d4d9e488cda4ef59dddc1e282a24a7b:7b89fb0393e54e55aea1d72c3e968223@sentry.io/263713',
    { environment: env }
  ).install();
  // The request handler must be the first middleware on the app
  app.use(Raven.requestHandler());
}

app.use(bodyParser.json());

app.set('port', process.env.PORT || API_DEV_PORT);

// Express only serves static assets in production
if (['production', 'qa'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));
}

app.get('/', (req, res) => {
  res.json({ message: 'Hello Guys! Welcome to roster!' });
});

app.get('/api/services', servicesController.getServices);

app.get('/api/events', eventsController.getEvents);

app.put('/api/events', eventsController.saveEvent);

app.put('/api/serviceInfo/:id', serviceInfoController.saveServiceInfo);

if (isServerEnvironment()) {
  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler());
}

app.use(exception.errorHandler);

function isServerEnvironment() {
  return (env === 'qa' || env === 'production')
}
