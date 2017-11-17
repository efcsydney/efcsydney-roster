const moment = require('moment');
const dateTimeFormat = require('../constants/datetime').dateTimeFormat;
const EventRepository = require('../data/event-repository').EventRepository;

class EventService {
  static computeDateRange(dateRange) {
    const { from, to } = dateRange;
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
      return EventService.createOrUpdateEvent(dbEvent);
    });
  }
  static createOrUpdateEvent(dbEvent) {
    if (!dbEvent.hasOwnProperty('id')) {
      throw exception('Expected id is not available');
    }
    if (dbEvent != null && dbEvent.id > 0) {
      return EventRepository.addEvent(event);
    } else {
      return EventRepository.saveEvent(event);
    }
  }
}

module.exports = { EventService };
