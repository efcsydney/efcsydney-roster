const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;

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
  }
});

module.exports = {
  Position
};
