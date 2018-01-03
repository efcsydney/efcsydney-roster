const getDateString = require('../../api/utilities/datetime-util')
  .getDateString;

module.exports = {
  // This will populate roughly 10 years of data from 2017
  up: (queryInterface, Sequelize) => {
    // First Sunday in 2017
    const dateTime = new Date(2017, 0, 1);
    const calendarDates = [];
    for (i = 0; i < 500; i++) {
      // Get date string and add to calendarDates
      dateString = getDateString(dateTime);
      calendarDates.push({ date: dateString });
      // Jump to next Sunday
      dateTime.setDate(dateTime.getDate() + 7);
    }
    return queryInterface.bulkInsert('calendar_dates', calendarDates);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('calendar_dates', null, {});
  }
};
