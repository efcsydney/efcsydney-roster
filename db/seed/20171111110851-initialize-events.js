const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const log = require('winston');

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    const calendarDatesData = (await sequelizeClient.query(
      'SELECT id from calendar_dates'
    ))[0];

    // Build positions mapper, which looks like: { 'Speaker': 1 }
    const positionsData = (await sequelizeClient.query(
      'SELECT id from positions'
    ))[0];

    const events = [];
    calendarDatesData.forEach(calendarDate => {
      positionsData.forEach(position => {
        events.push({
          calendarDateId: calendarDate.id,
          positionId: position.id
        });
      });
    });
    return queryInterface.bulkInsert('events', events);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('events', null, {});
  }
};
