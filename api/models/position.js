const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const Service = require('./service').Service;

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
  },
  serviceId: {
    type: Sequelize.STRING
  }
});

Position.Service = Position.belongsTo(Service, {
  as: 'service',
  foreignKey: 'serviceId'
});
Service.hasMany(Position);

module.exports = {
  Position
};
