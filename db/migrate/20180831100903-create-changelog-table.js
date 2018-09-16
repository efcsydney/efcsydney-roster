'use strict';

module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable(
      'changelogs',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        resourceType: {
          // resource type - events, users, services
          type: Sequelize.STRING
        },
        actionType: {
          // action type - create, update, delete
          type: Sequelize.STRING
        },
        reqData: {
          type: Sequelize.TEXT('medium')
        },
        saveData: {
          type: Sequelize.TEXT('medium')
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      },
      {
        charset: 'utf8'
      }
    ),
  down: queryInterface => queryInterface.dropTable('changelogs')
};
