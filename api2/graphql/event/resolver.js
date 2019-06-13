const { getEvents } = require('../../services/event-service');

module.exports = {
  Query: {
    events: (obj, { serviceCateory, from, to }) => {
      return getEvents(serviceCateory, from, to).then(events => events);
    }
  }
};
