const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn(
      'services',
      'frequencyId',
      Sequelize.INTEGER,
      {
        after: 'locale'
      },
      {
        charset: 'utf8'
      }
    );

    await queryInterface.addColumn(
      'services',
      'footnoteLabel',
      Sequelize.STRING,
      {
        after: 'frequencyId'
      },
      {
        charset: 'utf8'
      }
    );

    await sequelizeClient.query(
      'UPDATE services SET frequencyId = 1'
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
