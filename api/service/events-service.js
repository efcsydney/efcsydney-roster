const moment = require('moment');
const dateTimeFormat = require('../constants/datetime').dateTimeFormat;
const EventRepository = require('../data/event-repository').EventRepository;
const PositionRepository = require('../data/position-repository')
  .PositionRepository;
const CalendarDateRepository = require('../data/calendar-date-repository')
  .CalendarDateRepository;
const Factory = require('../models/factory').Factory;
class EventService {
  static computeDateRange(dateRange) {
    let { from, to } = dateRange;
    if (from === undefined) {
      from = new Date();
    }
    const rangeFrom = moment(from, dateTimeFormat.stringFormat);

    const rangeTo =
      to !== undefined
        ? moment(to, dateTimeFormat.stringFormat)
        : moment(from, dateTimeFormat.stringFormat).add(12, 'weeks');

    return { from: rangeFrom.toDate(), to: rangeTo.toDate() };
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
        return EventRepository.addEvent(event);
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
  static linkScheduledEventsToCalendarDates(dateRange, scheduledEvents) {
    return PositionRepository.getAll().then(positions => {
      const dates = EventService.getWeekdayDatesForTimePeriod(dateRange);
      let allEvents = EventService.linkPositionsToDates(positions, dates);

      scheduledEvents.forEach(scheduledEvent => {
        let event = allEvents.find(event => {
          return (
            moment(event.calendarDate.date).format(dateTimeFormat.stringFormat) ===
              moment(scheduledEvent.calendarDate.date).format(dateTimeFormat.stringFormat)
              && event.position.name == scheduledEvent.position.name
          );
        });
        if(event == null){
          return;
        }
        event.volunteerName = scheduledEvent.volunteerName;
      });

      return allEvents;
    });
  }
  static linkPositionsToDates(positions, dates) {
    let events = [];
    dates.forEach(date => {
      positions.forEach(position => {
        events.push(Factory.createEvent('', position, date.toDate()));
      });
    });
    return events;
  }
}

module.exports = { EventService };
