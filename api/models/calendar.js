const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client').sequelizeClient;
const Event = require('./event').Event;

const Calendar = sequelizeClient.define('calendars', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: Sequelize.DATE,
    unique: true,
  }
},{
  timestamps: false
});

module.exports = {
  Calendar
}