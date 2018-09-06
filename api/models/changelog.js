const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;

const Changelog = sequelizeClient.define('changelogs', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  resourceType: {
    type: Sequelize.STRING
  },
  actionType: {
    type: Sequelize.STRING
  },
  reqData: {
    type: Sequelize.TEXT('tiny')
  },
  saveData: {
    type: Sequelize.TEXT('tiny')
  }
});

module.exports = {
  Changelog
};
