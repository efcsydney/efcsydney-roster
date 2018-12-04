const { getServices } = require('../../services/event-service');

module.exports = {
  Query: {
    events: () => {
      return getServices().then(services => services);
    }
  }
};
