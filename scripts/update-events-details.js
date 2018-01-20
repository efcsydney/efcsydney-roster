const sequelizeClient = require('../api/infrastructure/sequelize-client')
  .sequelizeClient;
const Event = require('../api/models/event').Event;
const ServiceCalendarDate = require('../api/models/service-calendar-date').ServiceCalendarDate;
const { readAndParseFile } = require('../api/utilities/csv-helper');

/**
 * Find positions for service and build  mapper
 *
 * @param service {Object} eg. { id: 1, name: 'chinese' }
 * @return {Object} eg. { 'Speaker': 1 }
 */
async function buildPositionMapper(service) {
  const positionsData = (await sequelizeClient.query(
    `SELECT id, name from positions where serviceId = ${service.id}`
  ))[0];
  return positionsData.reduce((result, position) => {
    result[position.name] = position.id;
    return result;
  }, {});
}

async function updateEvents() {
  const serviceDetails = {
    english: readAndParseFile('./db/data/english-events.csv'),
    chinese: readAndParseFile('./db/data/chinese-events.csv')
  };

  // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT id, date from calendar_dates'
  ))[0];
  const dateMapper = calendarDatesData.reduce((result, calendarDate) => {
    result[calendarDate.date] = calendarDate.id;
    return result;
  }, {});
  // log.debug(dateMapper);

  const services = (await sequelizeClient.query(
    'SELECT id, name from services'
  ))[0];

  const promises = [];
  await Promise.all(
    services.map(async service => {
      const positionMapper = await buildPositionMapper(service);
      // log.debug(positionMapper);
      serviceDetails[service.name].forEach(row => {
        // Parse through each position and save it
        Object.keys(positionMapper).forEach(position => {
          const promise = Event.update(
            { volunteerName: row[position] },
            {
              where: {
                calendarDateId: dateMapper[row.Date],
                positionId: positionMapper[position]
              }
            }
          );
          promises.push(promise);
        });
      });
    })
  );
  await Promise.all(promises);
  sequelizeClient.close();
}

async function updateCombinedServiceForEnglishService(){
  const serviceDetails = {
    english: readAndParseFile('./db/data/english-events.csv'),
    chinese: readAndParseFile('./db/data/chinese-events.csv')
  };
  const trimAndToLowerCase = (value) => value.trim().toLowerCase();
  const isCombinedService = (serviceDetail) => Object.keys(serviceDetail)
    .map((position) => trimAndToLowerCase(serviceDetail[position]))
    .includes('combined service');

  // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT id, date from calendar_dates'
  ))[0];
  const dateMapper = calendarDatesData.reduce((result, calendarDate) => {
    result[calendarDate.date] = calendarDate.id;
    return result;
  }, {});

  const services = (await sequelizeClient.query(
    `SELECT id, name from services where name = 'english'`
  ))[0];

  const englishServices = serviceDetails.english
    .map((serviceDetail) => ({date: serviceDetail.Date, excluded: isCombinedService(serviceDetail)}));

  const promises = englishServices.map((service) => {
    const promise = ServiceCalendarDate.update({
      skipService: service.excluded,
      skipReason: (service.excluded) ? 'Combined Service' : ''
    },{
      where: {
        calendarDateId: dateMapper[service.date],
        serviceId: services[0].id
      }
    });
    return promise;
  });

  await Promise.all(promises);
  sequelizeClient.close();
}

updateEvents();
updateCombinedServiceForEnglishService();