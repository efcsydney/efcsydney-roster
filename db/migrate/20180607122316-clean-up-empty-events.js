const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const _ = require('lodash');

module.exports = {
  up: async () => {
    await sequelizeClient.query("DELETE FROM events WHERE volunteerName = ' '");
  },

  down: async queryInterface => {
    const calendarDatesData = (await sequelizeClient.query(
      'SELECT id from calendar_dates'
    ))[0];

    // Build positions mapper, which looks like: { 'Speaker': 1 }
    const positionsData = (await sequelizeClient.query(
      'SELECT id from positions'
    ))[0];

    const eventsInDb = (await sequelizeClient.query('SELECT * from events'))[0];

    const events = [];
    calendarDatesData.forEach(calendarDate => {
      positionsData.forEach(position => {
        const eventAlreadyExits = _.find(eventsInDb, function(o) {
          return (
            o.calendarDateId === calendarDate.id && o.positionId === position.id
          );
        });
        if (!eventAlreadyExits) {
          events.push({
            calendarDateId: calendarDate.id,
            positionId: position.id
          });
        }
      });
    });
    return queryInterface.bulkInsert('events', events);
  }
};
