'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('positions',[{
      name: 'Speaker',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Moderator',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'P&W',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Pianist',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Usher/Offering',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'PA/PPT',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Newsletter',
      createdAt: new Date(),
      updatedAt: new Date()
    },{
      name: 'Refreshments',
      createdAt: new Date(),
      updatedAt: new Date()
    }],{});

  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
