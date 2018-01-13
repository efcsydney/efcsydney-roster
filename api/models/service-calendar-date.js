const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const Service = require('./service').Service;
const CalendareDate = require('./calendar-date').CalendarDate;

const SerivceCalendarDate = sequelizeClient.define('service_calendar_dates', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  footnote: {
    type: Sequelize.STRING
  },
  skipService: {
    type: Sequelize.BOOLEAN
  },
  skipReason: {
    type: Sequelize.STRING
  },
  calendarDateId: {
    type: Sequelize.INTEGER
  },
  serviceId: {
    type: Sequelize.INTEGER
  }
});

SerivceCalendarDate.Service = SerivceCalendarDate.belongsTo(Service, {
  as: 'service',
  foreignKey: 'serviceId'
});
Service.hasMany(SerivceCalendarDate);

SerivceCalendarDate.CalendareDate = SerivceCalendarDate.belongsTo(CalendareDate, {
  as: 'calendarDate',
  foreignKey: 'calendarDateId'
});
CalendareDate.hasMany(SerivceCalendarDate);


module.exports = {
  SerivceCalendarDate
};