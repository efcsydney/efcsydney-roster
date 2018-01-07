const moment = require('moment');
const EventRepository = require('../data/event-repository').EventRepository;
const CalendarDateRepository = require('../data/calendar-date-repository')
  .CalendarDateRepository;
const log = require('winston');
const datetimeUtils = require('../utilities/datetime-util');
const getDateString = datetimeUtils.getDateString;
const getDateByWeeks = datetimeUtils.getDateByWeeks;

class EventService {
  static computeDateRange(dateRange) {
    let { from, to } = dateRange;
    if (!from) {
      from = getDateString(new Date());
    }
    if (!to) {
      to = getDateByWeeks(from, 12); // add 12 weeks to from date
    }
    return { from, to };
  }
  static saveEvent(event) {
    return EventRepository.getEventByDatePosition({
      date: event.calendarDate.date,
      position: event.position.name
    }).then(function(dbEvent) {
      if (dbEvent != null) {
        dbEvent.volunteerName = event.volunteerName;
        return EventRepository.updateEvent(dbEvent);
      } else {
        const msg = `Error: missing event in DB: ${JSON.stringify(event)}`;
        log.error(msg);
        return Promise.reject(new Error(msg));
      }
    });
  }
}

module.exports = { EventService };
