const {
  events,
  services,
  eventPositions,
  positions
} = require('../models/data');
const EventService = require('../../api/service/events-service').EventService;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

async function getEvents(serviceCategory, from, to) {
  const dateRange = EventService.computeDateRange({ from, to });

  return await events.findAll({
    where: {
      date: {
        [Op.between]: [dateRange.from, dateRange.to]
      }
    },
    include: [
      {
        model: services,
        required: false,
        where: {
          name: {
            [Op.eq]: serviceCategory
          }
        }
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
        model: positions,
        required: false
      },
      {
        model: events,
        required: false
      }
    ]
  });
}

module.exports = {
  getEvents,
  getServices
};
