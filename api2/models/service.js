const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const { Position } = require('./position');
const { Event } = require('./event');

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

// Event.Position = Event.belongsTo(Position, {
//   as: 'position',
//   foreignKey: 'positionId'
// });
Service.hasMany(Position, { foreignKey: 'serviceId' });
Service.hasMany(Event, { foreignKey: 'serviceId' });

module.exports = {
  Service
};
