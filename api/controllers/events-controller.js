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

// req params
// from: query string
// to?: query string
async function getEvents(req, res) {
  try {
    const eventRepository = Factory.getEventRepository(req);
    const dataMapper = Factory.getDataMapper(req);
    const eventService = Factory.getEventService(req);
    const dateRange = eventService.computeDateRange(req.query);
    const scheduledEvents = await eventRepository.getEventsByDateRange(
      dateRange
    );
    const dto = dataMapper.convertEventsModelToDto(scheduledEvents);

    res.json({
      result: 'OK',
      error: { message: '' },
      data: dto
    });
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
    log.info('saveEvent: ', req.body);
    const event = EventMapper.convertDtoToEventModel(req.body);
    log.info('event model: ', event);
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
