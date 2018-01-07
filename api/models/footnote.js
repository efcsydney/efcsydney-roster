const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const Service = require('./service').Service;
const CalendareDate = require('./calendar-date').CalendarDate;

const Footnote = sequelizeClient.define('footnotes', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: Sequelize.STRING,
    unique: true
  },
  calendarDateId: {
    type: Sequelize.INTEGER
  },
  serviceId: {
    type: Sequelize.INTEGER
  }
});

Footnote.Service = Footnote.belongsTo(Service, {
  as: 'service',
  foreignKey: 'serviceId'
});
Service.hasMany(Footnote);

Footnote.CalendareDate = Footnote.belongsTo(CalendareDate, {
  as: 'calendarDate',
  foreignKey: 'calendarDateId'
});
CalendareDate.hasMany(Footnote);


module.exports = {
  Footnote
};