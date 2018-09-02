const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;

const Event = sequelizeClient.define('events_v2', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: Sequelize.DATEONLY
  },
  footnote: {
    type: Sequelize.STRING
  },
  skipReason: {
    type: Sequelize.STRING
  },
  skipService: {
    type: Sequelize.BOOLEAN
  }
});

module.exports = {
  Event
};
