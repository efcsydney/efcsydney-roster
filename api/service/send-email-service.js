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

// This is mocked out for now, will be complete when DB is done
function getEmailList() {
  return 'a@exmample.com, b@example.com';
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
      events[service.name] = EventMapper.convertEventsModelToDto(
        eventsForService
      );
      events[service.name].lang = service.locale;
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
  log.info(JSON.stringify(events));

  return sendEmail({
    from: config.get('reminderEmail.content.from'),
    to: getEmailList(),
    cc: config.get('reminderEmail.content.cc'),
    subject: config.get('reminderEmail.content.subject'),
    html: getEmailHTML(events)
  });
}

module.exports = {
  reminderEmail
};
