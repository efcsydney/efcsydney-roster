const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const log = require('winston');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const calendarDatesData = (await sequelizeClient.query(
      'SELECT id from calendar_dates'
    ))[0];

    // Build positions mapper, which looks like: { 'Speaker': 1 }
    const positionsData = (await sequelizeClient.query(
      'SELECT id from positions WHERE serviceId = 2'
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

  down: async (queryInterface, Sequelize) => {
    const positionIds = (await sequelizeClient.query(
      'SELECT id from positions WHERE serviceId = 2'
    ))[0].map(position => position.id);

    return queryInterface.bulkDelete('events', { positionId: positionIds });
  }
};
