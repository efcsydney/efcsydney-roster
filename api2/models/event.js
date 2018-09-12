const Sequelize = require('sequelize');
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const { Service } = require('./service');

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
  },
  serviceId: {
    type: Sequelize.INTEGER
  }
});

module.exports = {
  Event
};
