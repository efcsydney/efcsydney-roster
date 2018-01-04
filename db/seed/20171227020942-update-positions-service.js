'use strict';
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
.sequelizeClient;

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await sequelizeClient.query(
      'UPDATE positions SET serviceId = 1 WHERE id BETWEEN 1 AND 8'
    )
  },
  down: (queryInterface, Sequelize) => {

  }
};
