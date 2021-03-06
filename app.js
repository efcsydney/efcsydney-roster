const _ = require('lodash');
const express = require('express');
const app = express();
module.exports.app = app;
const UserValidators = require('./api/validators/user-validator');
const bodyParser = require('body-parser');
const changelogsController = require('./api/controllers/changelogs-controller');
const emailController = require('./api/controllers/email-controller');
const eventsController = require('./api/controllers/events-controller');
const servicesController = require('./api/controllers/services-controller');
const exception = require('./api/middleware/exception-handler');
const httpRedirect = require('./api/middleware/http-redirect');
const serviceInfoController = require('./api/controllers/service-info-controller');
const userController = require('./api/controllers/user-controller');
const Raven = require('raven');
const env = _.get(process, 'env.NODE_ENV', 'development');
const config = require('config');
const graphqlHttp = require('express-graphql');
const schema = require('./api/schema');
const cors = require('cors');

if (isServerEnvironment()) {
  Raven.config(
    'https://6d4d9e488cda4ef59dddc1e282a24a7b:7b89fb0393e54e55aea1d72c3e968223@sentry.io/263713',
    { environment: env }
  ).install();
  // The request handler must be the first middleware on the app
  app.use(Raven.requestHandler());
}

app.use(bodyParser.json());

app.use('/graphql', cors(), graphqlHttp({ schema, graphiql: true }));

app.set('port', process.env.PORT || 3001);
app.set('secure-port', config.get('port.secure'));

//Comment out the Http Redirect middlware to prevent the redirection
if (['production', 'qa'].includes(env)) {
  app.use(httpRedirect);
}

// Express only serves static assets in production
if (['production', 'qa'].includes(env)) {
  app.use(express.static('client/build'));
}

app.get('/', (req, res) => {
  res.json({ message: 'Hello Guys! Welcome to roster!' });
});

app.get('/email', emailController.getEmail);

app.get('/api/changelogs', changelogsController.get);

app.get('/api/services', servicesController.getServices);

app.get('/api/events', eventsController.getEvents);

app.put('/api/events', eventsController.saveEvent);

app.put('/api/serviceInfo/:id', serviceInfoController.saveServiceInfo);

app.post('/api/serviceInfo', serviceInfoController.createServiceInfo);

app.get('/api/services', servicesController.getServices);

app.get('/api/services/:id', servicesController.getServiceById);

app.put('/api/services/:id', servicesController.saveService);

app.post('/api/services/', servicesController.saveService);

app.post('/api/users', UserValidators, userController.save);

app.put('/api/users/:id', UserValidators, userController.save);

app.get('/api/users', userController.get);

if (isServerEnvironment()) {
  // The error handler must be before any other error middleware
  app.use(Raven.errorHandler());
}

app.use(exception.errorHandler);

function isServerEnvironment() {
  return env === 'qa' || env === 'production';
}
