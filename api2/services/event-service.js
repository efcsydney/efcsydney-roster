const {
  events,
  services,
  eventPositions,
  positions
} = require('../models/data');

async function getEvents() {
  await events.findAll({
    include: [
      {
        model: services
      },
      {
        model: positions,
        through: eventPositions
      }
    ]
  });
}

module.exports = {
  getEvents
};
