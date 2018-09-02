'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'event_positions_v2',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING
        },
        eventId: {
          type: Sequelize.INTEGER
        },
        positionId: {
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
    return queryInterface.dropTable('event_positions_v2');
  }
};
