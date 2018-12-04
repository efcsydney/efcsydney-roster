const {
  events,
  services,
  eventPositions,
  positions
} = require('../models/data');

async function getEvents() {
  return await events.findAll({
    include: [
      {
        model: services,
        required: false
      },
      {
        model: positions,
        required: false,
        through: {
          as: 'eventPosition',
          eventPositions,
          required: false
        }
      }
    ]
  });
}

async function getServices(serviceId, eventStartDate, eventEndDate) {
  return await services.findAll({
    include: [
      {
        model: events,
        required: false
      },
      {
        model: positions,
        required: false,
        through: {
          as: 'eventPosition',
          eventPositions,
          required: false
        }
      }
    ]
  });
}

module.exports = {
  getEvents,
  getServices
};
