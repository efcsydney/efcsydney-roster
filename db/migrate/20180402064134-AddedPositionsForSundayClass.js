const sequelizeClient = require('../../api/infrastructure/sequelize-client')
  .sequelizeClient;
const getDateString = require('../../api/utilities/datetime-util')
  .getDateString;
const moment = require('moment');
const _ = require('lodash');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await alterPositionUniqueConstraint(queryInterface);
    await createCalendarDateForMonthlyEvent();
    await seedMonthlyEventServiceInfo(queryInterface);
    await seedSaturdayEventServiceInfo(queryInterface);
    await seedPositions(queryInterface);
    await createMonthlyEvents(queryInterface);
    await createSaturdayEvents(queryInterface);
  },

  down: async (queryInterface) => {
    const servicesData = (await sequelizeClient.query(
      `SELECT id, name, createdAt from services WHERE name IN ('preschool-junior')`
    ))[0];

    const juniorClassService = _.find(servicesData, { name: 'preschool-junior' });
    const timestamp = moment(juniorClassService.createdAt).subtract(1, 'minute').format('YYYY-MM-DD hh:mm:ss');

    await sequelizeClient.query(
      `DELETE FROM events WHERE createdAt >= '${timestamp}'`
    );

    await sequelizeClient.query(
      `DELETE FROM calendar_dates_frequencies WHERE createdAt > '${timestamp}'`
    );

    await sequelizeClient.query(
      `DELETE FROM service_calendar_dates WHERE createdAt > '${timestamp}'`
    );

    await sequelizeClient.query(
      `DELETE FROM calendar_dates WHERE createdAt > '${timestamp}'`
    );

    await sequelizeClient.query(
      `DELETE FROM positions WHERE createdAt > '${timestamp}'`
    );

    await queryInterface.removeConstraint('positions',
      'name_serviceId');

    await queryInterface.addConstraint('positions', ['name'], {
      type: 'unique',
      name: 'name'
    });
  },
};

async function seedPositions(queryInterface) {
  const servicesData = (await sequelizeClient.query(
    `SELECT id, name from services WHERE name IN ('preschool-junior','preschool-middle','preschool-senior', 'prayer')`
  ))[0];

  const juniorClassService = _.find(servicesData, { name: 'preschool-junior' });
  const middleClassService = _.find(servicesData, { name: 'preschool-middle' });
  const seniorClassService = _.find(servicesData, { name: 'preschool-senior' });
  const prayerService = _.find(servicesData, { name: 'prayer' });

  await queryInterface.bulkInsert('positions', [
    { name: '老師', order: 1, serviceId: juniorClassService.id },
    { name: '助教', order: 2, serviceId: juniorClassService.id },
    { name: '老師', order: 1, serviceId: middleClassService.id },
    { name: '助教', order: 2, serviceId: middleClassService.id },
    { name: '老師', order: 1, serviceId: seniorClassService.id },
    { name: '助教', order: 2, serviceId: seniorClassService.id },
    { name: 'Leader', order: 1, serviceId: prayerService.id },
    { name: 'Topic', order: 2, serviceId: prayerService.id },
    { name: 'Content', order: 3, serviceId: prayerService.id },
  ]);
}

async function alterPositionUniqueConstraint(queryInterface) {
  await queryInterface.removeConstraint('positions',
    'name');

  await queryInterface.addConstraint('positions', ['name', 'serviceId'], {
    type: 'unique',
    name: 'name_serviceId'
  });
}

async function createMonthlyEvents(queryInterface) {
  const monthlyService = (await sequelizeClient.query(
    `SELECT id FROM frequencies WHERE name = 'Month'`
  ))[0];
  const calendarDatesData = (await sequelizeClient.query(
    `SELECT id, date from calendar_dates d inner join calendar_dates_frequencies f on d.id = f.calendarDateId WHERE f.frequencyId =
    ${monthlyService[0].id}`
  ))[0];


  const positionsData = (await sequelizeClient.query(
    `SELECT id from positions WHERE name IN ('老師','助教')`
  ))[0];

  await seedEvents(queryInterface, calendarDatesData, positionsData);
}

async function createSaturdayEvents(queryInterface) {
  const saturdayFrequency = (await sequelizeClient.query(
    `SELECT id FROM frequencies WHERE name = 'Saturday'`
  ))[0];
  const calendarDatesData = (await sequelizeClient.query(
    `SELECT id, date from calendar_dates d inner join calendar_dates_frequencies f on d.id = f.calendarDateId WHERE f.frequencyId =
    ${saturdayFrequency[0].id}`
  ))[0];

  // Build positions mapper, which looks like: { 'Speaker': 1 }
  const positionsData = (await sequelizeClient.query(
    `SELECT id from positions WHERE name IN ('Leader','Topic','Content')`
  ))[0];

  await seedEvents(queryInterface, calendarDatesData, positionsData);
}

async function seedEvents(queryInterface, calendarDatesData, positionsData) {
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
    calendarDates.push({ date: dateString, day: 1 });
    // Jump to next Saturday
    dateTime.add(1, 'month');
    await sequelizeClient.query(
      `INSERT IGNORE INTO
        calendar_dates (date, day)
        VALUES     ('${dateString}', 1)`
    );
  }
  const monthlyFrequency = (await sequelizeClient.query(
    `SELECT id FROM frequencies WHERE name = 'Month'`
  ))[0];

  const monthlyFrequencyId = monthlyFrequency[0].id;
  //update frequency
  await sequelizeClient.query(
    `INSERT INTO calendar_dates_frequencies (calendarDateId, frequencyId) SELECT id, ${monthlyFrequencyId} FROM calendar_dates d LEFT JOIN calendar_dates_frequencies f ON d.id = f.calendarDateId WHERE f.frequencyId IS NULL and d.day = 1`
  );
}

async function seedMonthlyEventServiceInfo(queryInterface, Sequelize) {
  const monthlyFrequency = (await sequelizeClient.query(
    `SELECT id FROM frequencies WHERE name = 'Month'`
  ))[0];
  const calendarDatesData = (await sequelizeClient.query(
    `SELECT calendarDateId FROM calendar_dates_frequencies WHERE frequencyId = ${monthlyFrequency[0].id}`
  ))[0];

  const servicesData = (await sequelizeClient.query(
    `SELECT id from services WHERE name IN ('preschool-junior','preschool-middle','preschool-senior')`
  ))[0];

  return await seedServiceCalendarDates(queryInterface, calendarDatesData, servicesData);
}

async function seedSaturdayEventServiceInfo(queryInterface, Sequelize) {
  const saturdayFrequency = (await sequelizeClient.query(
    `SELECT id FROM frequencies WHERE name = 'Saturday'`
  ))[0];
  const saturdayService = (await sequelizeClient.query(
    `SELECT id FROM services WHERE name = 'prayer'`
  ))[0];
  const calendarDatesData = (await sequelizeClient.query(
    `SELECT calendarDateId FROM calendar_dates_frequencies WHERE frequencyId = ${saturdayFrequency[0].id}`
  ))[0];

  // Build positions mapper, which looks like: { 'Speaker': 1 }
  const servicesData = (await sequelizeClient.query(
    `SELECT id from services WHERE id IN (${saturdayService[0].id})`
  ))[0];

  return await seedServiceCalendarDates(queryInterface, calendarDatesData, servicesData);
}

async function seedServiceCalendarDates(queryInterface, calendarDatesData, servicesData) {
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