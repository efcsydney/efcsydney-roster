const EventService = require('../service/events-service').EventService;
const DtoMapper = require('../mapper/dto-mapper');
const log = require('../utilities/logger');
const pusher = require('../utilities/pusher');
const { ok, fail } = require('../utilities/response-helper');

/**
 * Get Events
 *
 * @param from {String} query string for date range, eg. '2017-01-01'
 * @param to? {String} query string for date range, eg. '2017-02-01'
 * @param category: query string
 */
async function getEvents(req, res, next) {
  try {
    const dateRange = EventService.computeDateRange(req.query);
    const { category: service } = req.query;
    const eventsByDateRange = await EventService.getEventsByDateRange(
      dateRange,
      service
    );
    const dto = DtoMapper.mapGroupEventsToDto(eventsByDateRange);

    res.json(ok(dto));
  } catch (err) {
    next(err);
  }
}

async function saveEvent(req, res, next) {
  try {
    log.info('saveEvent', req.body);
    const event = DtoMapper.convertDtoToEventModel(req.body);
    const updateEvent = await EventService.saveEvent(event);
    const data = DtoMapper.mapEventToDto(updateEvent);

    pusher.trigger('index', 'event-modified', data);
    res.status(201).json(ok(data));
  } catch (err) {
    log.error(err);
    next(err);
  }
}

module.exports = {
  getEvents,
  saveEvent
};
