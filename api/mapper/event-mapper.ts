import { getDateString } from '../utilities/datetime-util';

interface Event {
  volunteerName: string;
  calendarDate: CalendarDate;
  position: Position;
}

interface CalendarDate {
  date: string;
}

interface Position {
  name: string;
}

interface EventDate {
  date: string;
  positions: EventDatePosition[];
}

interface EventDatePosition {
}

export class EventMapper {
  static groupEventsByCalendarDate(events: Event[]) {
    // This is a collection of events for the specific date, which may look like:
    // {
    //   date: '2017-10-19',
    //   positions: [ { role: "A", name: "Brad" }, { role: "B", name: "Jack" } ]
    // }
    const eventDates: EventDate[] = [];

    // We have all the event objects in date order and position order already
    events.forEach(e => {
      // Build the event
      const event = {
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
  static formatDate(eventDate: EventDate) {
    eventDate.date = getDateString(eventDate.date);
    return eventDate;
  }

  static mapServiceInfoToEvents(serviceInfos, events) {
    const serviceInfoDates = serviceInfos.map(
      serviceInfo => serviceInfo.calendarDate.date
    );
    const eventDates = events.map(event => event.date);
    const dates = [...serviceInfoDates, ...eventDates];
    const distinctDates = dates.filter((date, pos, allDates) => {
      return allDates.indexOf(date) == pos;
    });

    return distinctDates.map(date => {
      const event = events.find(event => event.date == date);
      const serviceInfo = serviceInfos.find(
        serviceInfo => serviceInfo.calendarDate.date === date
      );
      if (!event) {
        return {
          date,
          serviceInfo
        };
      }
      event.serviceInfo = serviceInfo;
      return event;
    });
  }
}
