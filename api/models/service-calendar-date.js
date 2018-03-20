const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const Service = require('./service').Service;
const CalendareDate = require('./calendar-date').CalendarDate;

const ServiceCalendarDate = sequelizeClient.define('service_calendar_dates', {
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

ServiceCalendarDate.Service = ServiceCalendarDate.belongsTo(Service, {
  as: 'service',
  foreignKey: 'serviceId'
});
Service.hasMany(ServiceCalendarDate);

ServiceCalendarDate.CalendareDate = ServiceCalendarDate.belongsTo(
  CalendareDate,
  {
    as: 'calendarDate',
    foreignKey: 'calendarDateId'
  }
);
CalendareDate.hasMany(ServiceCalendarDate);


//Adde something here

module.exports = {
  ServiceCalendarDate
};
