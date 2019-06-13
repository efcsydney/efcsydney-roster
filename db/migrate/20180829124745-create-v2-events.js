'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'events_v2',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        date: {
          type: Sequelize.DATEONLY
        },
        footnote: {
          type: Sequelize.STRING
        },
        skipReason: {
          type: Sequelize.STRING
        },
        skipService: {
          type: Sequelize.BOOLEAN
        },
        serviceId: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      },
      {
        charset: 'utf8'
      }
    );
  },
  down: queryInterface => {
    return queryInterface.dropTable('events_v2');
  }
};
