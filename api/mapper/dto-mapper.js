const getDateString = require('../utilities/datetime-util').getDateString;

class DtoMapper {
  static mapGroupEventsToDto(events) {
    return events.map(e => {
      return {
        date: e.date,
        footnote: DtoMapper.mapFootnoteToDto(e.footnote),
        members: DtoMapper.mapEventsToDto(e.positions)
      };
    });
  }

  static mapEventsToDto(events) {
    return events.map(event => ({
      role: event.position,
      name: event.volunteerName
    }));
  }

  static mapFootnoteToDto(footnote) {
    return {
      id: footnote.id,
      name: footnote.footnote
    };
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

  static convertDtoToFootnoteModel(dto) {
    const { id, data } = dto;
    return {
      id: id,
      footnote: data.footnote,
      calendarDate: {
        date: getDateString(data.date)
      },
      service: { name: data.category }
    };
  }
}

module.exports = { DtoMapper };
