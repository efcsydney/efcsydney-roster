'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(
      'positions',
      [
        { id: 9, name: '證道', order: 9, serviceId: 2 },
        { id: 10, name: '司會', order: 10, serviceId: 2 },
        { id: 11, name: '詩歌讚美', order: 11, serviceId: 2 },
        { id: 12, name: '司琴', order: 12, serviceId: 2 },
        { id: 13, name: '招待', order: 13, serviceId: 2 },
        { id: 14, name: '司獻', order: 14, serviceId: 2 },
        { id: 15, name: '聖餐聖洗', order: 15, serviceId: 2 },
        { id: 16, name: '投影', order: 16, serviceId: 2 },
        { id: 17, name: '音控', order: 17, serviceId: 2 },
        { id: 18, name: '燈光', order: 18, serviceId: 2 },
        { id: 19, name: '督堂', order: 19, serviceId: 2 },
        { id: 20, name: '愛餐', order: 20, serviceId: 2 }
      ],
      {}
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(
      'positions',
      { id: [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
      {}
    );
  }
};
