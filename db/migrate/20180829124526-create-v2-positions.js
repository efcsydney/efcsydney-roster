'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'positions_v2',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        name: {
          type: Sequelize.STRING
        },
        order: {
          type: Sequelize.INTEGER
        },
        serviceId: {
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
    await queryInterface.bulkInsert('positions_v2', [
      { id: 1, name: 'Speaker', order: 1, serviceId: 1 },
      { id: 2, name: 'Moderator', order: 2, serviceId: 1 },
      { id: 3, name: 'P&W', order: 3, serviceId: 1 },
      { id: 4, name: 'Pianist', order: 4, serviceId: 1 },
      { id: 5, name: 'Usher/Offering', order: 5, serviceId: 1 },
      { id: 6, name: 'PA/PPT', order: 6, serviceId: 1 },
      { id: 7, name: 'Newsletter', order: 7, serviceId: 1 },
      { id: 8, name: 'Refreshments', order: 8, serviceId: 1 },
      { id: 9, name: '證道', order: 1, serviceId: 2 },
      { id: 10, name: '翻譯', order: 2, serviceId: 2 },
      { id: 11, name: '司會', order: 3, serviceId: 2 },
      { id: 12, name: '詩歌讚美', order: 4, serviceId: 2 },
      { id: 13, name: '司琴', order: 5, serviceId: 2 },
      { id: 14, name: '和音', order: 6, serviceId: 2 },
      { id: 15, name: '吉他鼓', order: 7, serviceId: 2 },
      { id: 16, name: '招待1', order: 8, serviceId: 2 },
      { id: 17, name: '招待2', order: 9, serviceId: 2 },
      { id: 18, name: '司獻1', order: 10, serviceId: 2 },
      { id: 19, name: '司獻2', order: 11, serviceId: 2 },
      { id: 20, name: '聖餐聖洗', order: 12, serviceId: 2 },
      { id: 21, name: '投影', order: 13, serviceId: 2 },
      { id: 22, name: '音控', order: 14, serviceId: 2 },
      { id: 23, name: '燈光', order: 15, serviceId: 2 },
      { id: 24, name: '愛餐', order: 16, serviceId: 2 },
      { id: 25, name: '督堂', order: 17, serviceId: 2 },
      { id: 26, name: '插花', order: 18, serviceId: 2 },
      { id: 27, name: '週報', order: 19, serviceId: 2 }
    ]);
  },
  down: queryInterface => {
    return queryInterface.dropTable('positions_v2');
  }
};
