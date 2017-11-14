'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('calendar_dates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      date: {
          type: Sequelize.DATE,
          unique: true,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }

    }, {
      charset: 'utf8'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('calendar_dates');
  }
};
