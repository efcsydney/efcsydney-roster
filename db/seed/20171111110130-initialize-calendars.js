'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'calendar_dates',
      [
        { id: 1, date: '2017-10-08' },
        { id: 2, date: '2017-10-15' },
        { id: 3, date: '2017-10-29' },
        { id: 4, date: '2017-11-05' },
        { id: 5, date: '2017-11-12' },
        { id: 6, date: '2017-11-19' },
        { id: 7, date: '2017-11-26' },
        { id: 8, date: '2017-12-03' },
        { id: 9, date: '2017-12-10' },
        { id: 10, date: '2018-01-21' },
        { id: 11, date: '2018-02-04' },
        { id: 12, date: '2018-02-18' },
        { id: 13, date: '2018-03-04' },
        { id: 14, date: '2018-03-18' },
        { id: 15, date: '2017-07-02' },
        { id: 16, date: '2017-07-09' },
        { id: 17, date: '2017-07-16' },
        { id: 18, date: '2017-07-23' },
        { id: 19, date: '2017-07-30' },
        { id: 20, date: '2017-08-06' },
        { id: 21, date: '2017-08-13' },
        { id: 22, date: '2017-08-20' },
        { id: 23, date: '2017-08-27' },
        { id: 24, date: '2017-09-10' },
        { id: 25, date: '2017-09-17' },
        { id: 26, date: '2017-09-24' }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('calendar_dates', null, {});
  }
};
