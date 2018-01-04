'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'positions',
      'serviceId',
      Sequelize.STRING,
      {
        after: 'order'
      }
    );
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn('positions', 'serviceId');
  }
};
