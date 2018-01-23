const getDateString = require('../utilities/datetime-util').getDateString;

class DtoMapper {
  static mapGroupEventsToDto(events) {
    return events.map(e => {
      return {
        date: e.date,
        serviceInfo: DtoMapper.mapServiceInfoToDto(e.serviceInfo),
        members: DtoMapper.mapEventPositionsToDto(e.positions)
      };
    });
  }

  static mapEventPositionsToDto(events) {
    return events.map(DtoMapper.mapEventPositionToDto);
  }

  static mapEventPositionToDto(event) {
    return {
      role: event.position,
      name: event.volunteerName
    }
  }

  static mapEventToDto(event){
    return {
      role: event.position.name,
      name: event.volunteerName,
      id: event.id,
      date: event.calendarDate.date,
    }
  }

  static mapServiceInfoToDto(serviceInfo) {
    return {
      id: serviceInfo.id,
      footnote: serviceInfo.footnote,
      skipService: serviceInfo.skipService,
      skipReason: serviceInfo.skipReason,
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

  static convertDtoToServiceInfoModel(dto) {
    const { id, data } = dto;
    return {
      id: id,
      footnote: data.footnote,
      skipService: data.skipService,
      skipReason: data.skipReason,
      calendarDate: {
        date: getDateString(data.date)
      },
      service: { name: data.category }
    };
  }
}

module.exports = { DtoMapper };
