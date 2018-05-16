const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const _ = require('lodash');

module.exports = {
  up: async () => {

    const servicesData = (await sequelizeClient.query(
      `SELECT id, name from services WHERE name IN ('prayer')`
    ))[0];

    const prayerService = _.find(servicesData, { name: 'prayer' });
    //Remove Topic and Content positions.
    await sequelizeClient.query(
      `DELETE FROM positions WHERE serviceId = ${
        prayerService.id
      } AND name IN ('Topic','Content')`
    );
  },

  down: () => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
