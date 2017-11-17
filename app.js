const express = require('express');
app = express();
module.exports.app = app;
const bodyParser = require('body-parser');
const eventsController = require('./api/controllers/events-controller');

app.use(bodyParser.json());

app.set('port', process.env.PORT || 3000);

// Express frond-end static assets
app.use(express.static('client/build'));

app.get('/', (req, res) => {
  res.json({ message: 'Hello Guys! Welcome to roster!' });
});

app.get('/api/eventsfromdb', eventsController.getEvents);

app.put('/api/events', (req, res) => {
  // TODO - @Jimmy or @Kyle
  // save res.json to MySQL
  console.log(req.body);
  return;
});

app.get('/api/events', (req, res) => {
  res.json({
    data: [
      {
        date: '2017-10-08',
        members: [
          { role: 'Speaker', name: 'May Chien' },
          { role: 'Moderator', name: 'Angela Sun' },
          { role: 'P&W', name: 'Edison Huang' },
          { role: 'Pianist', name: 'Joseph Wang' },
          { role: 'Usher/Offering', name: 'Cheer Lin' },
          { role: 'PA/PPT', name: 'Raymond Tsang' },
          { role: 'Newsletter', name: 'Kai Chang' },
          { role: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-10-15',
        members: [
          { role: 'Speaker', name: 'Rev. Kian Holik' },
          { role: 'Moderator', name: 'Jennifer Chu' },
          { role: 'P&W', name: 'Amy Chen' },
          { role: 'Pianist', name: 'Yvonne Lu' },
          { role: 'Usher/Offering', name: 'Christine Yang' },
          { role: 'PA/PPT', name: 'Raymond Tsang' },
          { role: 'Newsletter', name: 'Kai Chang' },
          { role: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-10-29',
        members: [
          { role: 'Speaker', name: 'Rev. Kian Holic' },
          { role: 'Moderator', name: 'Bobby Lu' },
          { role: 'P&W', name: 'Robin Zhang' },
          { role: 'Pianist', name: 'Angela Sun' },
          { role: 'Usher/Offering', name: 'Kai Chang' },
          { role: 'PA/PPT', name: 'Raymond Tsang' },
          { role: 'Newsletter', name: 'Joseph Chiang' },
          { role: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-11-5',
        members: [
          { role: 'Speaker', name: 'Rev. Kian Holik' },
          { role: 'Moderator', name: 'Gary Tan' },
          { role: 'P&W', name: 'Jenny Hsu' },
          { role: 'Pianist', name: 'Amy Chen' },
          { role: 'Usher/Offering', name: 'Cheer Lin' },
          { role: 'PA/PPT', name: 'Raymond Tsang' },
          { role: 'Newsletter', name: 'Kai Chang' },
          { role: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-11-12',
        members: [
          { role: 'Speaker', name: 'Aaron Goh' },
          { role: 'Moderator', name: 'Jennifer Chu' },
          { role: 'P&W', name: 'Amy Chen' },
          { role: 'Pianist', name: 'Brian Chen' },
          { role: 'Usher/Offering', name: 'Christine Yang' },
          { role: 'PA/PPT', name: 'Raymond Tsang' },
          { role: 'Newsletter', name: 'Joseph Chiang' },
          { role: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-11-19',
        members: [
          { role: 'Speaker', name: 'Kathleen Kao' },
          { role: 'Moderator', name: 'Angela Sun' },
          { role: 'P&W', name: 'Yvonne Lu' },
          { role: 'Pianist', name: 'Amy Chen' },
          { role: 'Usher/Offering', name: 'Cheer Lin' },
          { role: 'PA/PPT', name: 'Raymond Tsang' },
          { role: 'Newsletter', name: 'Kai Chang' },
          { role: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-11-26',
        members: [
          { role: 'Speaker', name: 'David Luis' },
          { role: 'Moderator', name: 'Gary Tan' },
          { role: 'P&W', name: 'Dan Kao' },
          { role: 'Pianist', name: 'Yvonne Lu' },
          { role: 'Usher/Offering', name: 'Kai Chang' },
          { role: 'PA/PPT', name: 'Raymond Tsang & Jenny Shao' },
          { role: 'Newsletter', name: 'Joseph Chiang' },
          { role: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-12-3',
        members: [
          { role: 'Speaker', name: '' },
          { role: 'Moderator', name: 'Bobby Lu' },
          { role: 'P&W', name: 'Yvonne Lu' },
          { role: 'Pianist', name: 'Angela Sun' },
          { role: 'Usher/Offering', name: 'Christine Yang' },
          { role: 'PA/PPT', name: 'Raymond Tsang' },
          { role: 'Newsletter', name: 'Kai Chang' },
          { role: 'Refreshments', name: 'Christine Yang' }
        ]
      },
      {
        date: '2017-12-10',
        members: [
          { role: 'Speaker', name: 'Gary Tan' },
          { role: 'Moderator', name: 'Dan Kao' },
          { role: 'P&W', name: 'Betty Chen' },
          { role: 'Pianist', name: 'Amy Chen' },
          { role: 'Usher/Offering', name: 'Cheer Lin' },
          { role: 'PA/PPT', name: 'Raymond Tsang' },
          { role: 'Newsletter', name: 'Kai Chang' },
          { role: 'Refreshments', name: 'Christine Yang' }
        ]
      }
    ],
    error: {}
  });
  return;
});
