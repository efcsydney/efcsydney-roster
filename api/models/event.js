const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client').sequelizeClient;
const CalendarDate = require('./calendar-date').CalendarDate;
const Position = require('./position').Position;

const Event = sequelizeClient.define('events', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  volunteerName: {
    type: Sequelize.STRING
  },
  calendarDateId: {
    type: Sequelize.INTEGER,
  },
  positionId: {
    type: Sequelize.INTEGER,
  }
});

Event.CalendarDate = Event.belongsTo(CalendarDate, {
  as: 'calendarDate',
  foreignKey: 'calendarDateId'
});
Event.Position = Event.belongsTo(Position, {
  as: 'position',
  foreignKey: 'positionId'
});

module.exports = {
  Event
}