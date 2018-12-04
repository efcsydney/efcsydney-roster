const { getEvents } = require('../../services/event-service');

module.exports = {
  Query: {
    events: () => {
      return getEvents().then(events => events);
    }
  }
};
