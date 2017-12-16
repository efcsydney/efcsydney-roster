const Event = require('../models/event').Event;
const CalendarDate = require('../models/calendar-date').CalendarDate;
const Position = require('../models/position').Position;
const EventRepository = require('../data/event-repository').EventRepository;
const PositionRepository = require('../data/position-repository')
  .PositionRepository;
const EventService = require('../service/events-service').EventService;
const EventMapper = require('../mapper/event-mapper').EventMapper;
const Factory = require('../service/factory').Factory;
const log = require('winston');

async function getEvents(req, res) {
  try {
    const eventRepository = Factory.getEventRepository(req);
    const dataMapper = Factory.getDataMapper(req);
    const eventService = Factory.getEventService(req);

    const dateRange = eventService.computeDateRange({
      from: req.query.from,
      to: req.query.to
    });
    const scheduledEvents = await eventRepository.getEventsByDateRange({
      from: dateRange.from,
      to: dateRange.to
    });
    const allEvents = await eventService.linkScheduledEventsToCalendarDates(
      dateRange,
      scheduledEvents
    );
    const dto = dataMapper.convertEventsModelToDto(allEvents);

    const response = {
      result: 'OK',
      error: { message: '' },
      data: dto
    };

    // log.info(JSON.stringify(response, null, 2));
    return res.json(response);
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      result: 'error',
      error: { message: err.message }
    });
  }
}

async function saveEvent(req, res) {
  try {
    console.log(req.body);
    const event = EventMapper.convertDtoToEventModel(req.body);
    console.log(event);
    await EventService.saveEvent(event);

    const response = {
      result: 'OK',
      error: { message: '' }
    };

    return res.status(201).json(response);
  } catch (err) {
    log.error(err);
    return res.status(500).json({
      result: 'error',
      error: { message: err.message }
    });
  }
}

module.exports = {
  getEvents,
  saveEvent
};
