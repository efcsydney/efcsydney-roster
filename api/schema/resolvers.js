const EventService = require('../service/events-service').EventService;
const { getChangelogs } = require('../service/changelogs-service');
const DtoMapper = require('../mapper/dto-mapper');
const queryString = require('query-string');

exports.resolveChangelogs = async (root, args) => {
  try {
    return await getChangelogs({ ...args });
  } catch (err) {
    throw new Error(err);
  }
};

exports.resolveEvents = async (root, args) => {
  try {
    const query = queryString.stringify({
      ...args
    });
    const { category: service } = query;
    const dateRange = EventService.computeDateRange(query);
    const eventsByDateRange = await EventService.getEventsByDateRange(
      dateRange,
      service
    );
    const data = DtoMapper.mapGroupEventsToDto(eventsByDateRange);
    return data;
  } catch (err) {
    throw new Error(err);
  }
};
