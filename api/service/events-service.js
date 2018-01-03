const moment = require('moment');
const EventRepository = require('../data/event-repository').EventRepository;
const CalendarDateRepository = require('../data/calendar-date-repository')
  .CalendarDateRepository;
const log = require('winston');
const getDateString = require('../utilities/datetime-util').getDateString;

class EventService {
  static computeDateRange(dateRange) {
    let { from, to } = dateRange;
    if (!from) {
      from = getDateString(new Date());
    }
    if (!to) {
      const toDate = new Date(from);
      // add 12 weeks to from date
      toDate.setDate(toDate.getDate() + 7 * 12);
      to = getDateString(toDate);
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
  static getWeekdayDatesForTimePeriod(dateRange, weekday = 7) {
    const { from, to } = dateRange;
    const firstSunday = moment(from).isoWeekday(weekday);
    const lastSunday = moment(to).startOf('week');
    let daysDiff = lastSunday.diff(firstSunday, 'days');
    let days = [];
    while (daysDiff > 0) {
      days.push(firstSunday.clone().add(daysDiff, 'days'));
      daysDiff = daysDiff - 7;
    }
    days.push(firstSunday);

    return days;
  }
}

module.exports = { EventService };
