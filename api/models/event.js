const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client').sequelizeClient;
const calendars = require('./calendar').calendars;
const positions = require('./position').positions;

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

export const events;