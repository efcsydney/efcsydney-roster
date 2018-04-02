const sequelizeClient = require('../api/infrastructure/sequelize-client')
  .sequelizeClient;
const Event = require('../api/models/event').Event;
const ServiceCalendarDate = require('../api/models/service-calendar-date').ServiceCalendarDate;
const { readAndParseFile } = require('../api/utilities/csv-helper');
const logger = require('../api/utilities/logger');

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

function getSundayClassDetailsFromCsvFile() {
  const serviceDetails = {
    "preschool-junior": readAndParseFile('./db/data/preschool-junior.csv'),
    //"preschool-middle": readAndParseFile('./db/data/chinese-events.csv'),
    //"preschool-senior": readAndParseFile('./db/data/chinese-events.csv'),
  };

  return serviceDetails;
}

function getServiceDetailsFromCsvFile() {
  const serviceDetails = {
    english: readAndParseFile('./db/data/english-events.csv'),
    chinese: readAndParseFile('./db/data/chinese-events.csv'),
  };

  return serviceDetails;
}

async function buildDateMapper() {
  // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT id, date from calendar_dates d inner join calendar_dates_frequencies f on d.id = f.calendarDateId WHERE f.frequencyId = 1'
  ))[0];
  const dateMapper = calendarDatesData.reduce((result, calendarDate) => {
    result[calendarDate.date] = calendarDate.id;
    return result;
  }, {});

  return dateMapper;
}

async function getSundayClassDateMapper() {
  // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT id, date from calendar_dates d inner join calendar_dates_frequencies f on d.id = f.calendarDateId WHERE f.frequencyId = 3'
  ))[0];
  const dateMapper = calendarDatesData.reduce((result, calendarDate) => {
    result[calendarDate.date] = calendarDate.id;
    return result;
  }, {});

  return dateMapper;
}

async function getServices(serviceNames) {
  const services = (await sequelizeClient.query(
    'SELECT id, name from services WHERE name IN (\'chinese\', \'english\')'
  ))[0];

  return services;
}

async function getSundayClassServices(serviceNames) {
  const services = (await sequelizeClient.query(
    'SELECT id, name from services WHERE name IN (\'preschool-junior\')'
  ))[0];

  return services;
}

async function updateSundayServiceEvents(){
  // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
  const serviceDetails = getServiceDetailsFromCsvFile();
  const dateMapper = await buildDateMapper();
  const services = await getServices();

  await updateEvents(dateMapper, services, serviceDetails);
  await updateServiceInfo(dateMapper, services, serviceDetails, 'english');
  await updateServiceInfo(dateMapper, services, serviceDetails, 'chinese');
}

async function updateEvents(dateMapper, services, serviceDetails) {
  const promises = [];
  await Promise.all(
    services.map(async service => {
      const positionMapper = await buildPositionMapper(service);
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
}

async function updateServiceInfo(dateMapper, services, serviceDetails, serviceName) {
  // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
  const footnoteColumn = 'Occassion';

  const trimAndToLowerCase = (value) => value.trim().toLowerCase();
  const isCombinedService = (serviceDetail) => Object.keys(serviceDetail)
    .filter((position) => position !== footnoteColumn)
    .map((position) => trimAndToLowerCase(serviceDetail[position]))
    .includes('combined service');

  const getFootnote = (serviceDetail) => serviceDetail[footnoteColumn].trim();
  const toServiceInfoItem = (serviceDetail) => ({
    date: serviceDetail.Date,
    excluded: isCombinedService(serviceDetail),
    footnote: getFootnote(serviceDetail),
  });

  const serviceId = services.filter((service) => service.name === serviceName)[0].id;
  const serviceInfos = serviceDetails[serviceName].map(toServiceInfoItem);
  await Promise.all(serviceInfos.map((serviceInfo) => updateServiceInfoItem(serviceInfo, serviceId, dateMapper)));
}

function updateServiceInfoItem(service, serviceId, dateMapper) {
  return ServiceCalendarDate.update({
    skipService: service.excluded,
    skipReason: (service.excluded) ? 'Combined Service' : '',
    footnote: service.footnote,
  }, {
      where: {
        calendarDateId: dateMapper[service.date],
        serviceId: serviceId,
      }
    });
}

async function updateSundayClassEvents() {
  const serviceDetails = getSundayClassDetailsFromCsvFile();
  const dateMapper = await getSundayClassDateMapper();
  const services = await getSundayClassServices();

  await updateEvents(dateMapper, services, serviceDetails);
  await updateServiceInfo(dateMapper, services, serviceDetails, 'preschool-junior');
  //await updateServiceInfo(dateMapper, services, serviceDetails, 'preschool-middle');
  //await updateServiceInfo(dateMapper, services, serviceDetails, 'preschool-senior');
}

async function syncDbFromServiceCsvFile() {
  await updateSundayServiceEvents();
  await updateSundayClassEvents();
  sequelizeClient.close();
}

syncDbFromServiceCsvFile();