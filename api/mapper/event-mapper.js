const moment = require('moment');
const dateTimeFormat = require('../constants/datetime').dateTimeFormat;
class EventMapper {
  static convertEventsModelToDto(events) {
    const eventDates = [];

    events.forEach(e => {
      const eventDate = eventDates.find(event => {
        return event.date.getTime() == e.calendarDate.date.getTime();
      });

      const event = { role: e.position.name, name: e.volunteerName };

      if (eventDate !== undefined) {
        eventDate.members.push(event);
      } else {
        eventDates.push({ date: e.calendarDate.date, members: [event] });
      }
    });

    return eventDates.map(eventDate => EventMapper.formatDate(eventDate));
  }
  static formatDate(eventDate) {
    eventDate.date = moment(eventDate.date).format(dateTimeFormat.stringFormat);
    return eventDate;
  }

  static convertDtoToEventModel(data) {
    return {
      volunteerName: data.name,
      calendarDate: {
        date: moment(data.date).startOf('day')
      },
      position: { name: data.role }
    };
  }
}

module.exports = { EventMapper };
