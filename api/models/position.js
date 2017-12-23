const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const Event = require('./event').Event;

const Position = sequelizeClient.define('positions', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  order: {
    type: Sequelize.INTEGER
  }
});

module.exports = {
  Position
};
