'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'services_v2',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING
        },
        locale: {
          type: Sequelize.STRING
        },
        footnoteLabel: {
          type: Sequelize.STRING
        },
        slug: {
          type: Sequelize.STRING
        },
        frequencyId: {
          type: Sequelize.INTEGER
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
    );
    await queryInterface.bulkInsert('services_v2', [
      { id: 1, name: 'english', locale: 'en-AU' },
      { id: 2, name: 'chinese', locale: 'zh-TW' }
    ]);
  },
  down: queryInterface => {
    return queryInterface.dropTable('services_v2');
  }
};
