const EventService = require('./events-service').EventService;
const MockRepository = require('../data/mock-repository').MockRepository;
const MockEventMapper = require('../mapper/mock-event-mapper').MockEventMapper;

class MockEventService {
  static computeDateRange(dateRange) {
    return EventService.computeDateRange(dateRange);
  }
  async getEventsByDateRange(dateRange, service = 'english') {
    return MockRepository.getEventsByDateRange(dateRange, service);
  }
}

module.exports = { MockEventService };
