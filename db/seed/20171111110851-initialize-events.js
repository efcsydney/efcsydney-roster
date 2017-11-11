'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('events', [{
      volunteerName: 'May Chien',
      calendarId: 1,
      positionId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Angela Sun',
      calendarId: 1,
      positionId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Edison Huang',
      calendarId: 1,
      positionId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Joseph Wang',
      calendarId: 1,
      positionId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Cheer Lin',
      calendarId: 1,
      positionId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Raymond Tsang',
      calendarId: 1,
      positionId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Kai Chang',
      calendarId: 1,
      positionId: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Christine Yang',
      calendarId: 1,
      positionId: 8,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      volunteerName: 'Rev. Kian Holik',
      calendarId: 2,
      positionId: 1,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Jennifer Chu',
      calendarId: 2,
      positionId: 2,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Amy Chen',
      calendarId: 2,
      positionId: 3,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Yvonne Lu',
      calendarId: 2,
      positionId: 4,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Christine Yang',
      calendarId: 2,
      positionId: 5,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Raymond Tsang',
      calendarId: 2,
      positionId: 6,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Kai Chang',
      calendarId: 2,
      positionId: 7,
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      volunteerName: 'Christine Yang',
      calendarId: 2,
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
