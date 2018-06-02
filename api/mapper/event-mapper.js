const getDateString = require('../utilities/datetime-util').getDateString;

class EventMapper {
  static groupEventsByCalendarDate(events) {
    // This is a collection of events for the specific date, which may look like:
    // {
    //   date: '2017-10-19',
    //   positions: [ { role: "A", name: "Brad" }, { role: "B", name: "Jack" } ]
    // }
    const eventDates = [];

    // We have all the event objects in date order and position order already
    events.forEach(e => {
      // Build the event
      const event = {
        id: e.id,
        position: e.position.name,
        volunteerName: e.volunteerName
      };

      // Check if the event date object is created already
      const eventDate = eventDates.find(event => {
        return event.date === e.calendarDate.date;
      });

      // Create the event date object if not there already
      if (eventDate !== undefined) {
        eventDate.positions.push(event);
      } else {
        eventDates.push({ date: e.calendarDate.date, positions: [event] });
      }
    });

    return eventDates.map(eventDate => EventMapper.formatDate(eventDate));
  }
  static formatDate(eventDate) {
    eventDate.date = getDateString(eventDate.date);
    return eventDate;
  }

  static mapServiceInfoToEvents(serviceInfos, events) {
    return events.map(event => {
      const eventServiceInfo = serviceInfos.find(
        serviceInfo => serviceInfo.calendarDate.date === event.date
      );
      event.serviceInfo = eventServiceInfo;
      return event;
    });
  }
}

module.exports = { EventMapper };
