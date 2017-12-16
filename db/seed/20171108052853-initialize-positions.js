'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'positions',
      [
        { id: 1, name: 'Speaker' },
        { id: 2, name: 'Moderator' },
        { id: 3, name: 'P&W' },
        { id: 4, name: 'Pianist' },
        { id: 5, name: 'Usher/Offering' },
        { id: 6, name: 'PA/PPT' },
        { id: 7, name: 'Newsletter' },
        { id: 8, name: 'Refreshments' }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('positions', null, {});
  }
};
