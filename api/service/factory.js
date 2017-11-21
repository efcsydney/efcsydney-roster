const EventRepository = require('../data/event-repository').EventRepository;
const MockRepository = require('../data/mock-repository').MockRepository;
const EventMapper = require('../mapper/event-mapper').EventMapper;
const MockEventMapper = require('../mapper/mock-event-mapper').MockEventMapper;
const EventService = require('../service/events-service').EventService;
const MockEventService = require('../service/mock-events-service').MockEventService;
class Factory {
  static getEventRepository(req) {
    if (req.query.mock === undefined || req.query.mock !== 'true') {
      return EventRepository;
    } else {
      return MockRepository;
    }
  }
  static getDataMapper(req) {
    if (req.query.mock === undefined || req.query.mock !== 'true') {
      return EventMapper;
    } else {
      return MockEventMapper;
    }
  }
  static getEventService(req) {
    if (req.query.mock === undefined || req.query.mock !== 'true') {
      return EventService;
    } else {
      return MockEventService;
    }
  }
}

module.exports = {
  Factory
};
