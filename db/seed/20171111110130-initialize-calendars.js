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
    }, {
      id: 10,
      date: '2018-01-21',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 11,
      date: '2018-02-04',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 12,
      date: '2018-02-18',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 13,
      date: '2018-03-04',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 14,
      date: '2018-03-18',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 15,
      date: '2017-07-02',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 16,
      date: '2017-07-09',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 17,
      date: '2017-07-16',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 18,
      date: '2017-07-23',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 19,
      date: '2017-07-30',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 20,
      date: '2017-08-06',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 21,
      date: '2017-08-13',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 22,
      date: '2017-08-20',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 23,
      date: '2017-08-27',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 24,
      date: '2017-09-10',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 25,
      date: '2017-09-17',
      createdAt: new Date(),
      updatedAt: new Date()
    }, {
      id: 26,
      date: '2017-09-24',
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('calendar_dates', null, {});
  }
};
