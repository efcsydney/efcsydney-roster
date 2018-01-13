const express = require('express');
app = express();
module.exports.app = app;
const bodyParser = require('body-parser');
const eventsController = require('./api/controllers/events-controller');
const exception = require('./api/middleware/exception-handler');
const footnoteController = require('./api/controllers/footnotes-controller');
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

app.set('port', process.env.PORT || 3001);

// Express only serves static assets in production
if (['production', 'qa'].includes(process.env.NODE_ENV)) {
  app.use(express.static('client/build'));
}

app.get('/', (req, res) => {
  res.json({ message: 'Hello Guys! Welcome to roster!' });
});

app.get('/api/events', eventsController.getEvents);

app.put('/api/events', eventsController.saveEvent);

app.put('/api/footnotes/:id', footnoteController.saveFootnote);

if (isServerEnvironment()) {
  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler());
}

app.use(exception.errorHandler);

function isServerEnvironment() {
  return (env === 'qa' || env === 'production')
}