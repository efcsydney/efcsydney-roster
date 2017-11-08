const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client');
const calendars = require('./calendar');
const positions = require('./position');

const events = sequelizeClient.define('events', {
  id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
  },
  volunteerName: {
      type: Sequelize.STRING
  }
  }, {
    timestamps: false
});

events.belongsTo(calendars);
events.belongsTo(positions);

module.exports = events;