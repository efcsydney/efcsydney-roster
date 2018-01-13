const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable(
      'service_calendar_dates',
      {
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
        serviceId: {
          type: Sequelize.INTEGER
        },
        calendarDateId: {
          type: Sequelize.INTEGER
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
            name: 'unique on calendar date and service',
            singleField: false,
            fields: ['calendarDateId', 'serviceId']
          }
        ]
      }
    );

    await seedServiceCalendarDate(queryInterface);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('service_calendar_dates');
  }
};

async function seedServiceCalendarDate(queryInterface){
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT id from calendar_dates'
  ))[0];

  // Build positions mapper, which looks like: { 'Speaker': 1 }
  const servicesData = (await sequelizeClient.query(
    'SELECT id from services'
  ))[0];

  const serviceCalendarDates = [];
  calendarDatesData.forEach(calendarDate => {
    servicesData.forEach(service => {
      serviceCalendarDates.push({
        footnote: '',
        skipService: false,
        skipReason: '',
        calendarDateId: calendarDate.id,
        serviceId: service.id
      });
    });
  });
  return queryInterface.bulkInsert('service_calendar_dates', serviceCalendarDates);
}
