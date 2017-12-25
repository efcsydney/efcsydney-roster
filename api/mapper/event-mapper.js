const getDateString = require('../utilities/datetime-util').getDateString;

class EventMapper {
  static convertEventsModelToDto(events) {
    // This is a collection of events for the specific date, which may look like:
    // {
    //   date: '2017-10-19',
    //   members: [ { role: "A", name: "Brad" }, { role: "B", name: "Jack" } ]
    // }
    const eventDates = [];

    // We have all the event objects in date order and position order already
    events.forEach(e => {
      // Build the event
      const event = { role: e.position.name, name: e.volunteerName };

      // Check if the event date object is created already
      const eventDate = eventDates.find(event => {
        return event.date === e.calendarDate.date;
      });

      // Create the event date object if not there already
      if (eventDate !== undefined) {
        eventDate.members.push(event);
      } else {
        eventDates.push({ date: e.calendarDate.date, members: [event] });
      }
    });

    return eventDates.map(eventDate => EventMapper.formatDate(eventDate));
  }
  static formatDate(eventDate) {
    eventDate.date = getDateString(eventDate.date);
    return eventDate;
  }

  static convertDtoToEventModel(data) {
    return {
      volunteerName: data.name,
      calendarDate: {
        date: getDateString(data.date)
      },
      position: { name: data.role }
    };
  }
}

module.exports = { EventMapper };
