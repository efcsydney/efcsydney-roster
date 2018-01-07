const getDateString = require('../utilities/datetime-util').getDateString;

class DtoMapper {
  static mapGroupEventsToDto(events) {
    return events.map(e => {
      return {
        date: e.date,
        footnote: DtoMapper.mapFootnoteToDto(e.footnote),
        members: DtoMapper.mapEventsToDto(e.positions)
      }
    });
  }

  static mapEventsToDto(events){
    return events.map((event) => ({
      role: event.position,
      name: event.volunteerName
    }));
  }

  static mapFootnoteToDto(footnote){
    if(footnote){
      return {
        id: footnote.id,
        name: footnote.name
      }
    }
    return {};
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

module.exports = { DtoMapper };