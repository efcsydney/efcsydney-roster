const Sequelize = require('sequelize');
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const { Service } = require('./service');

const Position = sequelizeClient.define('positions_v2', {
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
  }
});

module.exports = {
  Position
};
