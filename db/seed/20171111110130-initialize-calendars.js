'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('calendar_dates', [{
      id: 1,
      date: '2017-10-08',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 2,
      date: '2017-10-15',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 3,
      date: '2017-10-29',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 4,
      date: '2017-11-05',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 5,
      date: '2017-11-12',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 6,
      date: '2017-11-19',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 7,
      date: '2017-11-26',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 8,
      date: '2017-12-03',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 9,
      date: '2017-12-10',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('calendar_dates', null, {});
  }
};
