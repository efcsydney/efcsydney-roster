
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('frequencies', [
      { id: 4, name: 'Friday' },
      { id: 5, name: 'Thursday' },
      { id: 6, name: 'Wednesday' },
      { id: 7, name: 'Tuesday' },
      { id: 8, name: 'Monday' },
      { id: 9, name: 'Everyday' }]);
  },

  down: (queryInterface) => {
  }
};


