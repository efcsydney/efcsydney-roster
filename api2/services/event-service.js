const { Event } = require('../models/event');
const { Service } = require('../models/service');
const { EventPosition } = require('../models/event-position');
const { Position } = require('../models/position');

async function getEvents() {
  await Event.findAll({
    include: [
      {
        model: Service
      },
      {
        model: Position,
        through: EventPosition
      }
    ]
  });
}

module.exports = {
  getEvents
};
