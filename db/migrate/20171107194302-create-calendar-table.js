const getDateString = require('../../api/utilities/datetime-util')
.getDateString;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'calendar_dates',
      {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true
        },
        date: {
          type: Sequelize.DATEONLY,
          unique: true
        },
        createdAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        },
        updatedAt: {
          allowNull: false,
          type: Sequelize.DATE,
          defaultValue: Sequelize.fn('NOW')
        }
      },
      {
        charset: 'utf8'
      }
    );
    await seedCalendarDate(queryInterface);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('calendar_dates');
  }
};

function seedCalendarDate(queryInterface) {
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
}
