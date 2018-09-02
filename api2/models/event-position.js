const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const { Position } = require('./position');
const { Event } = require('./event');

const EventPosition = sequelizeClient.define('event_positions_v2', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING
  }
});

Position.belongsToMany(Event, { through: EventPosition });
Event.belongsToMany(Position, { through: EventPosition });

module.exports = {
  EventPosition
};
