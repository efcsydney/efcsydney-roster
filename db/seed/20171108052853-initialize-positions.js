'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'positions',
      [
        { id: 1, name: 'Speaker', order: 1 },
        { id: 2, name: 'Moderator', order: 2 },
        { id: 3, name: 'P&W', order: 3 },
        { id: 4, name: 'Pianist', order: 4 },
        { id: 5, name: 'Usher/Offering', order: 5 },
        { id: 6, name: 'PA/PPT', order: 6 },
        { id: 7, name: 'Newsletter', order: 7 },
        { id: 8, name: 'Refreshments', order: 8 }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('positions', null, {});
  }
};
