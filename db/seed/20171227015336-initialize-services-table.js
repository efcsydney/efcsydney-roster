module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'services',
      [
        { id: 1, name: 'english', locale: 'en-AU' },
        { id: 2, name: 'chinese', locale: 'zh-TW' }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('services', null, {});
  }
};
