const EventService = require('./events-service').EventService;
class MockEventService {
  static computeDateRange(dateRange) {
    return EventService.computeDateRange(dateRange);
  }
  static linkScheduledEventsForDateRange(dateRange, scheduledEvents) {
    return Promise.resolve(scheduledEvents);
  }
}

module.exports = { MockEventService };