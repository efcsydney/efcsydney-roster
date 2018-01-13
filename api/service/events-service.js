const moment = require('moment');
const EventRepository = require('../data/event-repository').EventRepository;
const CalendarDateRepository = require('../data/calendar-date-repository')
  .CalendarDateRepository;
const SerivceCalendarDateRepository = require('../data/service-calendar-date-repository').SerivceCalendarDateRepository;
const EventMapper = require('../mapper/event-mapper').EventMapper;
const log = require('winston');
const datetimeUtils = require('../utilities/datetime-util')
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
  static async getEventsByDateRange(dateRange, service = 'english'){
    const scheduledEvents = await EventRepository.getEventsByDateRange(
      dateRange,
      service
    );
    const scheduledEventsByDate = EventMapper.groupEventsByCalendarDate(scheduledEvents);

    const footnotes = await SerivceCalendarDateRepository.getServiceInfoByDateRange(
      dateRange,
      service
    );
    const eventsWithFootnotes = EventMapper.mapFootnotesToEvents(footnotes, scheduledEventsByDate);

    return eventsWithFootnotes;
  }
}

module.exports = { EventService };
