const moment = require('moment');
const dateTimeFormat = require('../constants/datetime').dateTimeFormat;
const EventRepository = require('../data/event-repository').EventRepository;

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
}

module.exports = { EventService };
