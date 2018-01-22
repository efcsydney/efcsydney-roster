const emailUtils = require('../../scripts/email/utils');
const sendEmail = emailUtils.sendEmail;
const getEmailHTML = emailUtils.getEmailHTML;
const datetimeUtil = require('../utilities/datetime-util');
const getDateString = datetimeUtil.getDateString;
const getDateByWeeks = datetimeUtil.getDateByWeeks;
const EventRepository = require('../data/event-repository').EventRepository;
const Service = require('../models/service').Service;
const EventMapper = require('../mapper/event-mapper').EventMapper;
const config = require('config');
const log = require('../utilities/logger');
const { readAndParseFile } = require('../utilities/csv-helper');
const { EmailListItem } = require('../models/email-list-item');

const emailCsvFilePath = config.get('reminderEmail.emailListFilePath');
const emailListFromCsv = parseCsvEmailFile(emailCsvFilePath);

// This is mocked out for now, will be complete when DB is done
function getEmailList() {
  const applyEmailTemplate = (emailTo) => {
    if(emailTo.englishName){
      return `${emailTo.englishName}<${emailTo.email}>`;
    }
    return `${emailTo.chineseName}<${emailTo.email}>`;
  }
  const emptyEmail = (emailTo) => !!emailTo.email;
  //we need to return the following format
  //新週報 <newsletter@efcsydney.org>, 教會音控 <ppt@efcsydney.org>, Eve Yeh<ginger_tab@hotmail.com>
  const emailString = emailListFromCsv
    .filter(emptyEmail)
    .map(applyEmailTemplate)
    .join(',');

  log.debug(emailString);
  return emailString;
}

function getEmptyEmailList() {
  const applyEmailTemplate = (emailTo) => emailTo.englishName ? `${emailTo.englishName}` : `${emailTo.chineseName}`;
  const nonEmptyEmail = (emailTo) => !emailTo.email;
  const emailString = emailListFromCsv
    .filter(nonEmptyEmail)
    .map(applyEmailTemplate)
    .join(',');

  log.debug(emailString);
  return emailString;
}

/*
  This function is supposed to take an input of CSV file directory and return a list of JS object
  [
    {
      email: 'fake_email@email.com,
      englishName: '',
      chineseName: '',
    }
  ]
*/
function parseCsvEmailFile(emailCsvFilePath){
  const emailList = readAndParseFile(emailCsvFilePath);
  const mapToEmailItem = (emailItem) => new EmailListItem(emailItem);
  const excludeMetadataItem = (emailItem) => !emailItem.isMetaData;

  const mappedEmailList = emailList
    .map(mapToEmailItem)
    .filter(excludeMetadataItem);

  return mappedEmailList;
}

// This is a mock due to we only have one service at the moment
async function buildEventsForMultipleServices(from, to) {
  const events = {};
  services = await Service.findAll();
  await Promise.all(
    services.map(async service => {
      const eventsForService = await EventRepository.getEventsByDateRange(
        { from, to },
        service.name
      );
      events[service.name] = EventMapper.groupEventsByCalendarDate(
        eventsForService
      );
      events[service.name] = events[service.name].map((event) => {
        event.lang = service.locale;
        return event;
      });
      return events;
    })
  );
  return events;
}

// reminderEmail will send email for the next 2 weeks
async function reminderEmail() {
  const from = getDateString(new Date());
  const to = getDateByWeeks(from, 2);
  const events = await buildEventsForMultipleServices(from, to);
  // log.debug(JSON.stringify(events, null, 2));

  return sendEmail({
    from: config.get('reminderEmail.content.from'),
    to: getEmailList(),
    cc: config.get('reminderEmail.content.cc'),
    subject: `[自動提醒] 這週與下週的主日服事`,
    html: getEmailHTML(events)
  });
}

module.exports = {
  reminderEmail,
  getEmailList,
  getEmptyEmailList,
  parseCsvEmailFile
};
