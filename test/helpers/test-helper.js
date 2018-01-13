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
const Service = require('../../api/models/service').Service;
const ServiceCalendarDate = require('../../api/models/service-calendar-date')
  .ServiceCalendarDate;

async function createSeed() {
  await Service.bulkCreate([
    { id: 1, name: 'english' },
    { id: 2, name: 'chinese' }
  ]);
  await Position.bulkCreate([
    { id: 1, name: 'Speaker', order: 1, serviceId: 1 },
    { id: 2, name: 'Moderator', order: 2, serviceId: 1 },
    { id: 3, name: 'P&W', order: 3, serviceId: 1 },
    { id: 4, name: 'Pianist', order: 4, serviceId: 1 },
    { id: 5, name: 'Usher/Offering', order: 5, serviceId: 1 },
    { id: 6, name: 'PA/PPT', order: 6, serviceId: 1 },
    { id: 7, name: 'Newsletter', order: 7, serviceId: 1 },
    { id: 8, name: 'Refreshments', order: 8, serviceId: 1 },
    { id: 9, name: '證道', order: 9, serviceId: 2 },
    { id: 10, name: '司會', order: 10, serviceId: 2 },
    { id: 11, name: '詩歌讚美', order: 11, serviceId: 2 },
    { id: 12, name: '司琴', order: 12, serviceId: 2 },
    { id: 13, name: '招待', order: 13, serviceId: 2 },
    { id: 14, name: '司獻', order: 14, serviceId: 2 },
    { id: 15, name: '聖餐聖洗', order: 15, serviceId: 2 },
    { id: 16, name: '投影', order: 16, serviceId: 2 },
    { id: 17, name: '音控', order: 17, serviceId: 2 },
    { id: 18, name: '燈光', order: 18, serviceId: 2 },
    { id: 19, name: '督堂', order: 19, serviceId: 2 },
    { id: 20, name: '愛餐', order: 20, serviceId: 2 }
  ]);
  await CalendarDate.bulkCreate([
    { id: 1, date: '2017-10-08' },
    { id: 2, date: '2017-10-15' },
    { id: 3, date: '2017-10-22' },
    { id: 4, date: '2017-10-29' },
    { id: 5, date: '2017-11-05' }
  ]);
  await ServiceCalendarDate.bulkCreate([
    { id: 1, footnote: 'english footnote 1', serviceId: 1, calendarDateId: 1 },
    { id: 2, footnote: 'chinese footnote 1', serviceId: 2, calendarDateId: 1 },
    { id: 3, footnote: 'english footnote 2', serviceId: 1, calendarDateId: 2 },
    { id: 4, footnote: 'chinese footnote 2', serviceId: 2, calendarDateId: 2 },
    { id: 5, footnote: 'english footnote 3', serviceId: 1, calendarDateId: 3 },
    { id: 6, footnote: 'chinese footnote 3', serviceId: 2, calendarDateId: 3 },
    { id: 7, footnote: 'english footnote 4', serviceId: 1, calendarDateId: 4 },
    { id: 8, footnote: 'chinese footnote 4', serviceId: 2, calendarDateId: 4 },
    { id: 9, footnote: 'english footnote 5', serviceId: 1, calendarDateId: 5 },
    { id: 10, footnote: 'chinese footnote 4', serviceId: 2, calendarDateId: 5 }
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
    },
    {
      volunteerName: 'May Chien',
      calendarDateId: 1,
      positionId: 9
    },
    {
      volunteerName: 'Angela Sun',
      calendarDateId: 1,
      positionId: 10
    },
    {
      volunteerName: 'Edison Huang',
      calendarDateId: 1,
      positionId: 11
    },
    {
      volunteerName: 'Joseph Wang',
      calendarDateId: 1,
      positionId: 12
    },
    {
      volunteerName: 'Cheer Lin',
      calendarDateId: 1,
      positionId: 13
    },
    {
      volunteerName: 'Raymond Tsang',
      calendarDateId: 1,
      positionId: 14
    },
    {
      volunteerName: 'Kai Chang',
      calendarDateId: 1,
      positionId: 15
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 1,
      positionId: 16
    },
    {
      volunteerName: 'Rev. Kian Holik',
      calendarDateId: 1,
      positionId: 17
    },
    {
      volunteerName: 'Jennifer Chu',
      calendarDateId: 1,
      positionId: 18
    },
    {
      volunteerName: 'Amy Chen',
      calendarDateId: 1,
      positionId: 19
    },
    {
      volunteerName: 'Yvonne Lu',
      calendarDateId: 1,
      positionId: 20
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 9
    },
    {
      volunteerName: 'Raymond Tsang',
      calendarDateId: 2,
      positionId: 10
    },
    {
      volunteerName: 'Kai Chang',
      calendarDateId: 2,
      positionId: 11
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 12
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 13
    },
    {
      volunteerName: 'Raymond Tsang',
      calendarDateId: 2,
      positionId: 14
    },
    {
      volunteerName: 'Kai Chang',
      calendarDateId: 2,
      positionId: 15
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 16
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 17
    },
    {
      volunteerName: 'Raymond Tsang',
      calendarDateId: 2,
      positionId: 18
    },
    {
      volunteerName: 'Kai Chang',
      calendarDateId: 2,
      positionId: 19
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 20
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 3,
      positionId: 9
    },
    {
      volunteerName: 'Raymond Tsang',
      calendarDateId: 3,
      positionId: 10
    },
    {
      volunteerName: 'Kai Chang',
      calendarDateId: 3,
      positionId: 11
    },
    {
      volunteerName: 'Christine Yang',
      calendarDateId: 3,
      positionId: 12
    }
  ]);
}

module.exports = {
  createSeed
};
