const emailUtils = require('../../scripts/email/utils');
const sendEmail = emailUtils.sendEmail;
const getEmailHTML = emailUtils.getEmailHTML;
const datetimeUtil = require('../utilities/datetime-util');
const getDateString = datetimeUtil.getDateString;
const getDateByWeeks = datetimeUtil.getDateByWeeks;
const EventRepository = require('../data/event-repository').EventRepository;
const ServiceCalendarDateRepository = require('../data/service-calendar-date-repository')
  .ServiceCalendarDateRepository;
const Service = require('../models/service').Service;
const EventMapper = require('../mapper/event-mapper').EventMapper;
const config = require('config');
const log = require('../utilities/logger');
const { readAndParseFile } = require('../utilities/csv-helper');
const { EmailListItem } = require('../models/email-list-item');
const _ = require('lodash');

const emailCsvFilePath = config.get('reminderEmail.emailListFilePath');
const emailListFromCsv = parseCsvEmailFile(emailCsvFilePath);

/**
 * Generate email list string include names and emails
 *
 * @return {String} example: 新週報 <newsletter@efcsydney.org>, 教會音控 <ppt@efcsydney.org>, Ava<ava_tab@example.com>
 */
function getEmailListString() {
  const applyEmailTemplate = emailTo => {
    if (emailTo.englishName) {
      return `${emailTo.englishName}<${emailTo.email}>`;
    }
    return `${emailTo.chineseName}<${emailTo.email}>`;
  };
  return getEmailList()
    .map(applyEmailTemplate)
    .join(',');
}

/*
 * Generate email list in javascript objects
 */
function getEmailList() {
  const emptyEmail = emailTo => !!emailTo.email;
  return emailListFromCsv.filter(emptyEmail);
}

function getEmptyEmailListString() {
  const applyEmailTemplate = emailTo =>
    emailTo.englishName ? `${emailTo.englishName}` : `${emailTo.chineseName}`;
  const nonEmptyEmail = emailTo => !emailTo.email;
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
function parseCsvEmailFile(emailCsvFilePath) {
  const emailList = readAndParseFile(emailCsvFilePath);
  const mapToEmailItem = emailItem => new EmailListItem(emailItem);
  const excludeMetadataItem = emailItem => !emailItem.isMetaData;

  const mappedEmailList = emailList
    .map(mapToEmailItem)
    .filter(excludeMetadataItem);

  return mappedEmailList;
}

// This is a mock due to we only have one service at the moment
async function buildEventsForMultipleServices(from, to) {
  const events = {};
  const services = await Service.findAll();
  await Promise.all(
    services.map(async service => {
      const eventsForService = await EventRepository.getEventsByDateRange(
        { from, to },
        service.name
      );
      const serviceInfo = await ServiceCalendarDateRepository.getServiceInfoByDateRange(
        { from, to },
        service.name
      );
      events[service.name] = EventMapper.groupEventsByCalendarDate(
        eventsForService
      );
      events[service.name].forEach((event, index) => {
        event.lang = service.locale;
        event.serviceInfo = serviceInfo[index];
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
  let events = await buildEventsForMultipleServices(from, to);
  events = _.pick(events, ['english', 'chinese']); // Only show these 2 services for now #215
  const nameList = getNameList(events);
  const emailList = getEmailList();
  // Get the email list that need to be included in reminder email
  const reminderEmailList = emailList.filter(e => {
    return nameList.includes(e.englishName) || nameList.includes(e.chineseName);
  });
  // Find the names of people that is included in the reminder
  let nameListWithEmail = reminderEmailList.map(e => e.englishName);
  nameListWithEmail = nameListWithEmail
    .concat(reminderEmailList.map(e => e.chineseName))
    .filter(e => e != '');
  // Find the names of people that need to be reminded but is not in the reminder list
  const nameListWithoutEmail = nameList
    .filter(n => !nameListWithEmail.includes(n))
    .filter(n => n !== 'Combined Service' && n !== '暫停' && n !== '一家一菜')
    .join(',');

  return sendEmail({
    from: config.get('reminderEmail.content.from'),
    to: config.get('reminderEmail.content.to'),
    cc: config.get('reminderEmail.content.cc'),
    subject: `[自動提醒] 這週與下週的主日服事`,
    html: getEmailHTML(events, reminderEmailList, nameListWithoutEmail)
  });
}

function filterPositions(positions = [], blacklist) {
  blacklist = blacklist || config.get('reminderEmail.skipRoles') || [];
  return positions.filter(({ position }) => !blacklist.includes(position));
}

function getNameList(events) {
  return _.uniq(
    events.english
      .concat(events.chinese)
      .map(day => filterPositions(day.positions))
      .reduce((result, e) => result.concat(e), [])
      .map(e => e.volunteerName)
      .filter(e => e != '')
  );
}

module.exports = {
  reminderEmail,
  filterPositions,
  getEmailList,
  getEmailListString,
  getEmptyEmailListString,
  parseCsvEmailFile
};
