const Sequelize = require('sequelize');
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const { Service } = require('./service');

const Frequency = sequelizeClient.define('frequencies_v2', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  }
});

Frequency.hasMany(Service);

module.exports = {
  Frequency
};
