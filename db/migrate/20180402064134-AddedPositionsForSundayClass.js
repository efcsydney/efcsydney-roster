const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const getDateString = require('../../api/utilities/datetime-util')
  .getDateString;
const moment = require('moment');
const CalendarDate = require('../../api/models/calendar-date').CalendarDate;
const logger = require('../../api/utilities/logger');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await alterPositionUniqueConstraint(queryInterface);

    await createCalendarDateForMonthlyEvent();

    await seedMonthlyEventServiceInfo(queryInterface, Sequelize);
    await seedSaturdayEventServiceInfo(queryInterface, Sequelize);

    await queryInterface.bulkInsert('positions', [
      { id: 28, name: '老師', order: 1, serviceId: 3 },
      { id: 29, name: '助教', order: 2, serviceId: 3 },
      { id: 30, name: '老師', order: 1, serviceId: 4 },
      { id: 31, name: '助教', order: 2, serviceId: 4 },
      { id: 32, name: '老師', order: 1, serviceId: 5 },
      { id: 33, name: '助教', order: 2, serviceId: 5 },
      { id: 34, name: 'Leader', order: 1, serviceId: 6 },
      { id: 35, name: 'Topic', order: 2, serviceId: 6 },
      { id: 36, name: 'Content', order: 3, serviceId: 6 },
    ]);

    await createMonthlyEvents(queryInterface);
    await createSaturdayEvents(queryInterface);
  },

  down: async (queryInterface, Sequelize) => {
    // await sequelizeClient.query(
    //   'DELETE FROM positions WHERE id BETWEEN 28 AND 30'
    // );
    // await sequelizeClient.query(
    //   'DELETE FROM positions WHERE id BETWEEN 28 AND 30'
    // );
  },


};

async function alterPositionUniqueConstraint(queryInterface) {
  await queryInterface.removeConstraint('positions',
    'name');

  await queryInterface.addConstraint('positions', ['name', 'serviceId'], {
    type: 'unique',
    name: 'name_serviceId'
  });
}

async function createMonthlyEvents(queryInterface){
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT id, date from calendar_dates d inner join calendar_dates_frequencies f on d.id = f.calendarDateId WHERE f.frequencyId = 3'
  ))[0];

  // Build positions mapper, which looks like: { 'Speaker': 1 }
  const positionsData = (await sequelizeClient.query(
    'SELECT id from positions WHERE id >= 28 AND id <= 33'
  ))[0];

  await seedEvents(queryInterface, calendarDatesData, positionsData);
}

async function createSaturdayEvents(queryInterface){
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT id, date from calendar_dates d inner join calendar_dates_frequencies f on d.id = f.calendarDateId WHERE f.frequencyId = 2'
  ))[0];

  // Build positions mapper, which looks like: { 'Speaker': 1 }
  const positionsData = (await sequelizeClient.query(
    'SELECT id from positions WHERE id > 33'
  ))[0];

  await seedEvents(queryInterface, calendarDatesData, positionsData);
}

async function seedEvents(queryInterface, calendarDatesData, positionsData){
  const events = [];
  calendarDatesData.forEach(calendarDate => {
    positionsData.forEach(position => {
      events.push({
        calendarDateId: calendarDate.id,
        positionId: position.id
      });
    });
  });
  return queryInterface.bulkInsert('events', events);
}

async function createCalendarDateForMonthlyEvent() {
  const dateTime = new moment('2017-01-01');
  const calendarDates = [];
  for (let i = 0; i < 500; i++) {
    // Get date string and add to calendarDates
    let dateString = getDateString(dateTime);
    logger.debug(dateString);
    calendarDates.push({ date: dateString, day: 1 });
    // Jump to next Saturday
    dateTime.add(1, 'month');
    await sequelizeClient.query(
      `INSERT IGNORE INTO
        calendar_dates (date, day)
        VALUES     ('${dateString}', 1)`
    );
  }
  //update frequency
  await sequelizeClient.query(
    'INSERT INTO calendar_dates_frequencies (calendarDateId, frequencyId) SELECT id, 3 FROM calendar_dates d LEFT JOIN calendar_dates_frequencies f ON d.id = f.calendarDateId WHERE f.frequencyId IS NULL and d.day = 1'
  );
}

async function seedMonthlyEventServiceInfo(queryInterface, Sequelize) {
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT calendarDateId FROM calendar_dates_frequencies WHERE frequencyId = 3'
  ))[0];

  // Build positions mapper, which looks like: { 'Speaker': 1 }
  const servicesData = (await sequelizeClient.query(
    'SELECT id from services WHERE id IN (3, 4, 5)'
  ))[0];

  return await seedServiceCalendarDates(queryInterface, calendarDatesData, servicesData);
}

async function seedSaturdayEventServiceInfo(queryInterface, Sequelize) {
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT calendarDateId FROM calendar_dates_frequencies WHERE frequencyId = 2'
  ))[0];

  // Build positions mapper, which looks like: { 'Speaker': 1 }
  const servicesData = (await sequelizeClient.query(
    'SELECT id from services WHERE id IN (6)'
  ))[0];

  return await seedServiceCalendarDates(queryInterface, calendarDatesData, servicesData);
}

async function seedServiceCalendarDates(queryInterface, calendarDatesData, servicesData){
  const serviceCalendarDates = [];
  calendarDatesData.forEach(calendarDate => {
    servicesData.forEach(service => {
      serviceCalendarDates.push({
        footnote: '',
        skipService: false,
        skipReason: '',
        calendarDateId: calendarDate.calendarDateId,
        serviceId: service.id
      });
    });
  });

  return queryInterface.bulkInsert(
    'service_calendar_dates',
    serviceCalendarDates
  );
}