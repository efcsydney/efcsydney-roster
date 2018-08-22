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

    await queryInterface.bulkInsert('frequencies', [
      { id: 1, name: 'Sunday' },
      { id: 2, name: 'Saturday' },
      { id: 3, name: 'Month' }
    ]);
  },

  down: queryInterface => {
    return queryInterface.dropTable('frequencies');
  }
};
