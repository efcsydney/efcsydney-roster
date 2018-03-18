module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'services',
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
        locale: {
          type: Sequelize.STRING
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
    await queryInterface.bulkInsert('services', [
      { id: 1, name: 'english', locale: 'en-AU' },
      { id: 2, name: 'chinese', locale: 'zh-TW' }
    ]);
  },
  down: (queryInterface) => {
    return queryInterface.dropTable('services');
  }
};
