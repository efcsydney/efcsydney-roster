const EventRepository = require('../data/event-repository').EventRepository;
const MockRepository = require('../data/mock-repository').MockRepository;
const EventMapper = require('../mapper/event-mapper').EventMapper;
const MockEventMapper = require('../mapper/mock-event-mapper').MockEventMapper;
const EventService = require('./events-service').EventService;
const MockEventService = require('./mock-events-service').MockEventService;
class Factory {
  static getEventService(req) {
    if (req.query.mock === 'true') {
      return MockEventService;
    } else {
      return EventService;
    }
  }
}

module.exports = {
  Factory
};
