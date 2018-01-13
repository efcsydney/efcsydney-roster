'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'service_calendar_dates',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        footnote: {
          type: Sequelize.STRING
        },
        skipService: {
          type: Sequelize.BOOLEAN
        },
        skipReason: {
          type: Sequelize.STRING
        },
        serviceId: {
          type: Sequelize.INTEGER
        },
        calendarDateId: {
          type: Sequelize.INTEGER
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        }
      },
      {
        charset: 'utf8',
        uniqueKeys: [
          {
            name: 'unique on calendar date and service',
            singleField: false,
            fields: ['calendarDateId', 'serviceId']
          }
        ]
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('service_calendar_dates');
  }
};
