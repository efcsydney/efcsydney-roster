'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('events', [{
      volunteerName: 'May Chien',
      calendarDateId: 1,
      positionId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Angela Sun',
      calendarDateId: 1,
      positionId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Edison Huang',
      calendarDateId: 1,
      positionId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Joseph Wang',
      calendarDateId: 1,
      positionId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Cheer Lin',
      calendarDateId: 1,
      positionId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Raymond Tsang',
      calendarDateId: 1,
      positionId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Kai Chang',
      calendarDateId: 1,
      positionId: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Christine Yang',
      calendarDateId: 1,
      positionId: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      volunteerName: 'Rev. Kian Holik',
      calendarDateId: 2,
      positionId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Jennifer Chu',
      calendarDateId: 2,
      positionId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Amy Chen',
      calendarDateId: 2,
      positionId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Yvonne Lu',
      calendarDateId: 2,
      positionId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Raymond Tsang',
      calendarDateId: 2,
      positionId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Kai Chang',
      calendarDateId: 2,
      positionId: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Christine Yang',
      calendarDateId: 2,
      positionId: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('events', null, {});
  }
};
