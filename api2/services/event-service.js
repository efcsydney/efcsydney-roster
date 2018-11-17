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
        model: services
      },
      {
        model: positions,
        through: {
          as: 'eventPosition',
          eventPositions
        }
      }
    ]
  });
}

module.exports = {
  getEvents
};
