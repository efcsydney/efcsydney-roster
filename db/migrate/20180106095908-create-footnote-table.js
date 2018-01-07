'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'footnotes',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
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
    return queryInterface.dropTable('footnotes');
  }
};
