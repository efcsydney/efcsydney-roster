'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(
      'users',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        primaryName: {
          type: Sequelize.STRING,
          validate: {
            notEmpty: true
          }
        },
        secondaryName: {
          type: Sequelize.STRING
        },
        email: {
          type: Sequelize.STRING,
          unique: true,
          validate: {
            notEmpty: true
          }
        },
        phone: {
          type: Sequelize.STRING
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
    return queryInterface.dropTable('users');
  }
};
