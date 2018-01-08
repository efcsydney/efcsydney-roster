'use strict';
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;

module.exports = {
  up: async function up(queryInterface, Sequelize) {
    const calendarDatesData = (await sequelizeClient.query(
      'SELECT id from calendar_dates'
    ))[0];

    // Build positions mapper, which looks like: { 'Speaker': 1 }
    const servicesData = (await sequelizeClient.query(
      'SELECT id from services'
    ))[0];

    const footnotes = [];
    calendarDatesData.forEach(calendarDate => {
      servicesData.forEach(service => {
        footnotes.push({
          name: '',
          calendarDateId: calendarDate.id,
          serviceId: service.id
        });
      });
    });
    return queryInterface.bulkInsert('footnotes', footnotes);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
