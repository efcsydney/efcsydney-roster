const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'frequencies',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING,
          unique: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        }
      },
      {
        charset: 'utf8'
      }
    );

    await queryInterface.bulkInsert('frequencies', [
      { id: 1, name: 'Every Sunday' },
      { id: 2, name: 'Every Saturday'},
      { id: 3, name: 'Monthly' },]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('frequencies');
  }
};


