'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('events', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      }
    }, {
      charset: 'utf8'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('events');
  }
};
