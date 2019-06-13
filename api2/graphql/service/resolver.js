const { getServices } = require('../../services/event-service');

module.exports = {
  Query: {
    services: () => {
      return getServices().then(services => services);
    }
  }
};
