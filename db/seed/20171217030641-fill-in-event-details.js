const Papa = require('papaparse');
const fs = require('fs');
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const Event = require('../../api/models/event').Event;
const file = './db/data/events.csv';
const log = require('winston');

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    const fileContent = fs.readFileSync(file, { encoding: 'binary' });
    const parsedData = Papa.parse(fileContent, { header: true }).data;

    // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
    const calendarDatesData = (await sequelizeClient.query(
      'SELECT id, date from calendar_dates'
    ))[0];
    const dateMapper = calendarDatesData.reduce((result, calendarDate) => {
      date = calendarDate.date.toISOString().slice(0, 10);
      result[date] = calendarDate.id;
      return result;
    }, {});
    // log.debug(dateMapper);

    // Build positions mapper, which looks like: { 'Speaker': 1 }
    const positionsData = (await sequelizeClient.query(
      'SELECT id, name from positions'
    ))[0];
    const positionMapper = positionsData.reduce((result, position) => {
      result[position.name] = position.id;
      return result;
    }, {});
    // log.debug(positionMapper);

    const promises = [];
    parsedData.forEach(row => {
      // Parse through each position and save it
      Object.keys(positionMapper).forEach(position => {
        const promise = Event.update(
          { volunteerName: row[position] },
          {
            where: {
              calendarDateId: dateMapper[row.Date],
              positionId: positionMapper[position]
            }
          }
        );
        promises.push(promise);
      });
    });
    return Promise.all(promises);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.resolve();
  }
};
