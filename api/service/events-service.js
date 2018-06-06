const moment = require('moment');
const EventRepository = require('../data/event-repository').EventRepository;
const ServiceCalendarDateRepository = require('../data/service-calendar-date-repository')
  .ServiceCalendarDateRepository;
const CalendarDateRepository = require('../data/calendar-date-repository')
  .CalendarDateRepository;
const PositionRepository = require('../data/position-repository')
  .PositionRepository;
const ServiceRepository = require('../data/service-repository')
  .ServiceRepository;
const EventMapper = require('../mapper/event-mapper').EventMapper;
const log = require('../utilities/logger');
const datetimeUtils = require('../utilities/datetime-util');
const getDateString = datetimeUtils.getDateString;
const getDateByWeeks = datetimeUtils.getDateByWeeks;
const ServiceInfoService = require('./service-info-service').ServiceInfoService;

class EventService {
  static computeDateRange(dateRange) {
    let { from, to } = dateRange;
    if (!from) {
      from = getDateString(new Date());
    }
    if (!to) {
      to = getDateByWeeks(from, 12); // add 12 weeks to from date
    }
    return { from, to };
  }
  static async saveEvent(event) {
    //save serviceInfo
    const serviceInfo = await ServiceInfoService.saveServiceInfo(
      event.serviceInfo
    );

    let dbEvent = await EventRepository.getEventByDatePositionServiceName({
      date: event.calendarDate.date,
      position: event.position.name,
      serviceName: event.serviceInfo.service.name
    });

    if (!dbEvent) {
      const service = await ServiceRepository.getServiceByName(
        event.serviceInfo.service.name
      );
      const position = await PositionRepository.getByNameAndServiceId({
        positionName: event.position.name,
        serviceId: service.id
      });
      let calendarDate = await CalendarDateRepository.getByDate(
        event.calendarDate.date
      );
      if (!calendarDate) {
        calendarDate = await CalendarDateRepository.create(
          event.calendateDate.date
        );
      }

      dbEvent = await EventRepository.createEvent({
        volunteerName: event.volunteerName,
        calendarDateId: calendarDate.id,
        positionId: position.id
      });
    } else {
      dbEvent.volunteerName = event.volunteerName;
      await EventRepository.updateEvent(dbEvent);
    }

    dbEvent = await EventRepository.getEventByDatePositionServiceName({
      date: event.calendarDate.date,
      position: event.position.name,
      serviceName: event.serviceInfo.service.name
    });

    return {
      ...dbEvent.dataValues,
      serviceInfo: { ...serviceInfo.dataValues }
    };
  }
  static getEventByDatePosition(event) {
    return EventRepository.getEventByDatePosition({
      date: event.calendarDate.date,
      position: event.position.name
    }).then(function(dbEvent) {
      if (dbEvent != null) {
        return Promise.resolve(dbEvent);
      } else {
        const msg = `Error: missing event in DB: ${JSON.stringify(event)}`;
        log.error(msg);
        return Promise.reject(new Error(msg));
      }
    });
  }

  static getWeekdayDatesForTimePeriod(dateRange, weekday = 7) {
    const { from, to } = dateRange;
    const firstSunday = moment(from).isoWeekday(weekday);
    const lastSunday = moment(to).startOf('week');
    let daysDiff = lastSunday.diff(firstSunday, 'days');
    let days = [];
    while (daysDiff > 0) {
      days.push(firstSunday.clone().add(daysDiff, 'days'));
      daysDiff = daysDiff - 7;
    }
    days.push(firstSunday);

    return days;
  }
  static async getEventsByDateRange(dateRange, service = 'english') {
    const scheduledEvents = await EventRepository.getEventsByDateRange(
      dateRange,
      service
    );
    const scheduledEventsByDate = EventMapper.groupEventsByCalendarDate(
      scheduledEvents
    );

    const serviceInfo = await ServiceCalendarDateRepository.getServiceInfoByDateRange(
      dateRange,
      service
    );
    const eventsWithFootnotes = EventMapper.mapServiceInfoToEvents(
      serviceInfo,
      scheduledEventsByDate
    );

    return eventsWithFootnotes;
  }
}

module.exports = { EventService };
