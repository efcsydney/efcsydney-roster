'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'events',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        volunteerName: {
          type: Sequelize.STRING
        },
        calendarDateId: {
          type: Sequelize.INTEGER,
          unique: 'compositeIndex'
        },
        positionId: {
          type: Sequelize.INTEGER,
          unique: 'compositeIndex'
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE
        }
      },
      {
        charset: 'utf8'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events');
  }
};
