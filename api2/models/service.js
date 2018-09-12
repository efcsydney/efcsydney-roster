const Sequelize = require('sequelize');
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const { Event } = require('./event');
const { Position } = require('./position');

const Service = sequelizeClient.define('services_v2', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  },
  locale: {
    type: Sequelize.STRING
  },
  footnoteLabel: {
    type: Sequelize.STRING
  },
  slug: {
    type: Sequelize.STRING
  }
});

Service.hasMany(Position, { foreignKey: 'serviceId' });
Service.hasMany(Event, { foreignKey: 'serviceId' });

module.exports = {
  Service
};
