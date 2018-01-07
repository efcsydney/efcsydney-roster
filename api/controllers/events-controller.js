
const EventService = require('../service/events-service').EventService;
const DtoMapper = require('../mapper/dto-mapper').DtoMapper;
const Factory = require('../service/factory').Factory;
const log = require('winston');

// req params
// from: query string
// to?: query string
// category: query string
async function getEvents(req, res) {
  try {
    const eventService = Factory.getEventService(req);
    const dateRange = eventService.computeDateRange(req.query);
    const { category: service } = req.query;
    const eventsByDateRange = await eventService.getEventsByDateRange(dateRange, service);
    const dto = DtoMapper.mapGroupEventsToDto(eventsByDateRange);

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
    const event = DtoMapper.convertDtoToEventModel(req.body);
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
