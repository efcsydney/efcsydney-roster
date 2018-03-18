const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;

module.exports = {
  up: async function up(queryInterface) {
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

  down: (queryInterface) => {
    return queryInterface.bulkDelete('events', null, {});
  }
};
