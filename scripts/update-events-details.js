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

function getServiceDetailsFromCsvFile(){
  const serviceDetails = {
    english: readAndParseFile('./db/data/english-events.csv'),
    chinese: readAndParseFile('./db/data/chinese-events.csv')
  };

  return serviceDetails;
}

async function buildDateMapper(){
  // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
  const calendarDatesData = (await sequelizeClient.query(
    'SELECT id, date from calendar_dates'
  ))[0];
  const dateMapper = calendarDatesData.reduce((result, calendarDate) => {
    result[calendarDate.date] = calendarDate.id;
    return result;
  }, {});

  return dateMapper;
}

async function getServices(){
  const services = (await sequelizeClient.query(
    'SELECT id, name from services'
  ))[0];

  return services;
}

async function updateEvents() {
  const serviceDetails = getServiceDetailsFromCsvFile();

  // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
  const dateMapper = await buildDateMapper();
  const services = await getServices();

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
}

async function updateServiceInfo(){
  const serviceDetails = getServiceDetailsFromCsvFile();
  // Build calendar dates mapper, which looks like: { '2017-01-01': 1 }
  const dateMapper = await buildDateMapper();
  const services = await getServices();
  const footnoteColumn = 'Occassion';

  const trimAndToLowerCase = (value) => value.trim().toLowerCase();
  const isCombinedService = (serviceDetail) => Object.keys(serviceDetail)
    .filter((position) => position !== footnoteColumn)
    .map((position) => trimAndToLowerCase(serviceDetail[position]))
    .includes('combined service');

  const getFootnote = (serviceDetail) => serviceDetail[footnoteColumn].trim();
  const toServiceInfoItem = (serviceDetail) => ({date: serviceDetail.Date,
    excluded: isCombinedService(serviceDetail),
    footnote: getFootnote(serviceDetail),
  });

  const englishServiceId =  services.filter((service) => service.name === 'english')[0].id;
  const chineseServiceId =  services.filter((service) => service.name === 'chinese')[0].id;
  const chineseServiceInfos = serviceDetails.chinese.map(toServiceInfoItem);
  const englishServiceInfos = serviceDetails.english.map(toServiceInfoItem);

  await Promise.all(chineseServiceInfos.map((chineseServiceInfo) => updateServiceInfoItem(chineseServiceInfo, chineseServiceId, dateMapper)));
  await Promise.all(englishServiceInfos.map((englishServiceInfo) => updateServiceInfoItem(englishServiceInfo, englishServiceId, dateMapper)));
}

function updateServiceInfoItem(service, serviceId, dateMapper){
    return ServiceCalendarDate.update({
      skipService: service.excluded,
      skipReason: (service.excluded) ? 'Combined Service' : '',
      footnote: service.footnote,
    },{
      where: {
        calendarDateId: dateMapper[service.date],
        serviceId: serviceId,
      }
    });
}

async function syncDbFromServiceCsvFile(){
  await updateEvents();
  await updateServiceInfo();
  sequelizeClient.close();
}

syncDbFromServiceCsvFile();