const getDateString = require('../../api/utilities/datetime-util')
  .getDateString;
const addByMonth = require('../../api/utilities/datetime-util')
  .addByMonth;
const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'calendar_dates_frequencies',
      {
        calendarDateId: {
          type: Sequelize.INTEGER,
        },
        frequencyId: {
          type: Sequelize.INTEGER,
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
        charset: 'utf8',
        uniqueKeys: [
          {
            name: 'unique on calendar date and frequency',
            singleField: false,
            fields: ['calendarDateId', 'frequencyId']
          }
        ]
      }
    );

    await queryInterface.addColumn(
      'calendar_dates',
      'frequencyId',
      Sequelize.INTEGER,
      {
        after: 'date'
      },
      {
        charset: 'utf8'
      }
    );

    await queryInterface.addColumn(
      'calendar_dates',
      'day',
      Sequelize.INTEGER,
      {
        after: 'frequencyId'
      },
      {
        charset: 'utf8'
      }
    );

    await seedSaturdayFrequency(queryInterface);
    await seedSundayFrequency(queryInterface);
    await seedMonthlyFrequency(queryInterface);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('calendar_dates_frequencies');
  }
};

async function seedSundayFrequency(queryInterface) {
  //all records in calendar_dates table are Sudnay dates
  await sequelizeClient.query(
    'UPDATE calendar_dates SET frequencyId = 1'
  );

  await sequelizeClient.query(
    'INSERT INTO calendar_dates_frequencies (calendarDateId, frequencyId) SELECT id, 1 FROM calendar_dates WHERE frequencyId = 1'
  );
}

async function seedSaturdayFrequency(queryInterface) {
  // First Saturday in 2017
  const dateTime = new Date(2017, 0, 7);
  const calendarDates = [];
  for (i = 0; i < 500; i++) {
    // Get date string and add to calendarDates
    dateString = getDateString(dateTime);
    calendarDates.push({ date: dateString, frequencyId: 2 });
    // Jump to next Saturday
    dateTime.setDate(dateTime.getDate() + 7);
  }
  //insert all Saturday dates into calendar-dates table
  await queryInterface.bulkInsert('calendar_dates', calendarDates);

  //update frequency
  await sequelizeClient.query(
    'INSERT INTO calendar_dates_frequencies (calendarDateId, frequencyId) SELECT id, 2 FROM calendar_dates WHERE frequencyId = 2'
  );
}

async function updateCalendarDayField(){
  await sequelizeClient.query(
    `UPDATE calendar_dates c
    INNER JOIN
      calendar_dates d
    ON
      c.id = d.id
    SET
      c.day = CONVERT(SUBSTRING(d.date, 9, 2), SIGNED INTEGER)`
  );
}

async function seedMonthlyFrequency(queryInterface) {
  await updateCalendarDayField();
  //update frequency
  await sequelizeClient.query(
    'INSERT INTO calendar_dates_frequencies (calendarDateId, frequencyId) SELECT id, 3 FROM calendar_dates WHERE day = 1'
  );
}
