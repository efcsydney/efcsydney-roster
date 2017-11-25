const express = require('express');
app = express();
module.exports.app = app;
const bodyParser = require('body-parser');
const eventsController = require('./api/controllers/events-controller');

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
