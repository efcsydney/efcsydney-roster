'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'positions',
      [
        {
          id: 1,
          name: 'Speaker',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 2,
          name: 'Moderator',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 3,
          name: 'P&W',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 4,
          name: 'Pianist',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 5,
          name: 'Usher/Offering',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 6,
          name: 'PA/PPT',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 7,
          name: 'Newsletter',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 8,
          name: 'Refreshments',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('positions', null, {});
  }
};
