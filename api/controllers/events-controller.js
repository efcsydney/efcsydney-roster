
const EventService = require('../service/events-service').EventService;
const DtoMapper = require('../mapper/dto-mapper').DtoMapper;
const Factory = require('../service/factory').Factory;
const log = require('../utilities/logger');

/**
 * Get Events
 *
 * @param from {String} query string for date range, eg. '2017-01-01'
 * @param to? {String} query string for date range, eg. '2017-02-01'
 * @param category: query string
 */
async function getEvents(req, res, next) {
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
    next(err);
  }
}

async function saveEvent(req, res, next) {
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
    next(err);
  }
}

module.exports = {
  getEvents,
  saveEvent
};
