const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const Event = require('./event').Event;

const CalendarDate = sequelizeClient.define('calendar_dates', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  date: {
    type: Sequelize.DATEONLY,
    unique: true
  }
});

module.exports = {
  CalendarDate
};
