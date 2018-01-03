process.env.TZ = 'Australia/Sydney';

const mocha = require('mocha');
const DatabaseCleaner = require('database-cleaner');
const databaseCleaner = new DatabaseCleaner('mysql', {
  mysql: {
    strategy: 'truncation',
    skipTables: ['SequelizeMeta']
  }
});
const mysql = require('mysql2');
const config = require(__dirname + '/../../config/database.json')['test'];

async function cleanDB() {
  const client = mysql.createConnection({
    user: config.username,
    host: config.host,
    database: config.database.toLowerCase()
  });
  await new Promise(resolve => {
    databaseCleaner.clean(client, () => resolve());
  });
}

beforeEach(async function() {
  await cleanDB();
});

const Event = require('../../api/models/event').Event;
const CalendarDate = require('../../api/models/calendar-date').CalendarDate;
const Position = require('../../api/models/position').Position;

async function createSeed() {
  await Position.bulkCreate([
    { id: 1, name: 'Speaker', order: 1 },
    { id: 2, name: 'Moderator', order: 2 },
    { id: 3, name: 'P&W', order: 3 },
    { id: 4, name: 'Pianist', order: 4 },
    { id: 5, name: 'Usher/Offering', order: 5 },
    { id: 6, name: 'PA/PPT', order: 6 },
    { id: 7, name: 'Newsletter', order: 7 },
    { id: 8, name: 'Refreshments', order: 8 }
  ]);
  await CalendarDate.bulkCreate([
    { id: 1, date: '2017-10-08' },
    { id: 2, date: '2017-10-15' },
    { id: 3, date: '2017-10-22' },
    { id: 4, date: '2017-10-29' },
    { id: 5, date: '2017-11-05' }
  ]);
  await Event.bulkCreate([
    {
      volunteerName: 'May Chien',
      calendarDateId: 1,
      positionId: 1
    },
    {
      volunteerName: 'Angela Sun',
      calendarDateId: 1,
      positionId: 2
    },
    {
      volunteerName: 'Edison Huang',
      calendarDateId: 1,
      positionId: 3
    },
    {
      volunteerName: 'Joseph Wang',
      calendarDateId: 1,
      positionId: 4
    },
    {
      volunteerName: 'Cheer Lin',
      calendarDateId: 1,
      positionId: 5
    },
    {
      volunteerName: 'Raymond Tsang',
      calendarDateId: 1,
      positionId: 6
    },
    {
      volunteerName: 'Kai Chang',
      calendarDateId: 1,
      positionId: 7
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 1,
      positionId: 8
    },
    {
      volunteerName: 'Rev. Kian Holik',
      calendarDateId: 2,
      positionId: 1
    },
    {
      volunteerName: 'Jennifer Chu',
      calendarDateId: 2,
      positionId: 2
    },
    {
      volunteerName: 'Amy Chen',
      calendarDateId: 2,
      positionId: 3
    },
    {
      volunteerName: 'Yvonne Lu',
      calendarDateId: 2,
      positionId: 4
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 5
    },
    {
      volunteerName: 'Raymond Tsang',
      calendarDateId: 2,
      positionId: 6
    },
    {
      volunteerName: 'Kai Chang',
      calendarDateId: 2,
      positionId: 7
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 8
    },
    {
      volunteerName: 'Rev. Kian Holik',
      calendarDateId: 3,
      positionId: 1
    },
    {
      volunteerName: 'Jennifer Chu',
      calendarDateId: 3,
      positionId: 2
    },
    {
      volunteerName: 'Amy Chen',
      calendarDateId: 3,
      positionId: 3
    },
    {
      volunteerName: 'Yvonne Lu',
      calendarDateId: 3,
      positionId: 4
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 3,
      positionId: 5
    },
    {
      volunteerName: 'Raymond Tsang',
      calendarDateId: 3,
      positionId: 6
    },
    {
      volunteerName: 'Kai Chang',
      calendarDateId: 3,
      positionId: 7
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 3,
      positionId: 8
    }
  ]);
}

module.exports = {
  createSeed
};
