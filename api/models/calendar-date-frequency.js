const Sequelize = require('sequelize');
const sequelizeClient = require('../infrastructure/sequelize-client')
  .sequelizeClient;
const Frequency = require('./frequency').Frequency;
const CalendareDate = require('./calendar-date').CalendarDate;

const CalendarDateFrequency = sequelizeClient.define('calendar_dates_frequencies', {
  calendarDateId: {
    type: Sequelize.INTEGER,
  },
  frequencyId: {
    type: Sequelize.INTEGER,
  },
});

Frequency.belongsToMany(CalendareDate, { through: CalendarDateFrequency });
CalendareDate.belongsToMany(Frequency, { through: CalendarDateFrequency });


module.exports = {
  CalendarDateFrequency
};
