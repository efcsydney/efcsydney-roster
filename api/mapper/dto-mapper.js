const getDateString = require('../utilities/datetime-util').getDateString;
const FrequencyRepository = require('../data/frequency-repository')
  .FrequencyRepository;
const _ = require('lodash');

class DtoMapper {
  static mapGroupEventsToDto(events) {
    return events.map(e => {
      return {
        id: !e.serviceInfo ? 0 : e.serviceInfo.id,
        date: e.date,
        serviceInfo: DtoMapper.mapServiceInfoToDto(e.serviceInfo),
        members: DtoMapper.mapEventPositionsToDto(e.positions)
      };
    });
  }

  static mapEventPositionsToDto(events) {
    if (!events) {
      return [];
    }
    return events.map(DtoMapper.mapEventPositionToDto);
  }

  static mapEventPositionToDto(event) {
    return {
      role: event.position,
      name: event.volunteerName
    };
  }

  static mapEventToDto(event) {
    return {
      role: event.position.name,
      name: event.volunteerName,
      date: event.calendarDate.date,
      serviceInfo: DtoMapper.mapServiceInfoToDto(event.serviceInfo)
    };
  }

  static mapServiceInfoToDto(serviceInfo) {
    if (!serviceInfo) {
      return [];
    }
    return {
      id: serviceInfo.id,
      footnote: serviceInfo.footnote,
      skipService: serviceInfo.skipService,
      skipReason: serviceInfo.skipReason
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
      position: { name: data.role },
      serviceInfo: DtoMapper.convertDtoToServiceInfoModel({
        data: data.serviceInfo,
        id: data.serviceInfo.id
      })
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

  static mapServiceToDto(service) {
    return {
      id: service.id,
      name: service.name,
      locale: service.locale,
      label: service.label,
      footnoteLabel: service.footnoteLabel,
      frequency: _.get(service.frequency, 'name', ''),
      positions: _.get(service, 'positions', [])
    };
  }

  static mapServicesToDto(services) {
    return services.map(DtoMapper.mapServiceToDto);
  }

  static async mapServiceDtoToModel(dto) {
    const { id, data } = dto;
    const frequency = await FrequencyRepository.getFrequencyByName(
      data.frequency
    );
    return {
      id,
      ...data,
      frequencyId: frequency.id
    };
  }
}

module.exports = DtoMapper;
