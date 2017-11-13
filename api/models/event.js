const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client').sequelizeClient;
const Calendar = require('./calendar').Calendar;
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
  calendarId: {
    type: Sequelize.INTEGER,
  },
  positionId: {
    type: Sequelize.INTEGER,
  }
});

Event.Calendar = Event.belongsTo(Calendar);
Event.Position = Event.belongsTo(Position);

module.exports = {
  Event
}