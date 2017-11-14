const Event = require('../models/event').Event;
const Calendar = require('../models/calendar').Calendar;
const Position = require('../models/position').Position;
const Repository = require('../data/repository').Repository;
const EventService = require("../service/events-service").EventService;
const EventMapper = require("../mapper/event-mapper").EventMapper;

async function getEvents(req, res) {
  const dateRange = EventService.computeDateRange({from: req.query.from, to: req.query.to});
  const events = await Repository.getEventsByDateRange({from: dateRange.from, to: dateRange.to});
  const dto = EventMapper.convertEventsModelToDto(events);

  const response = {
    success: true,
    error: { message: ""},
    data: dto
  }

  console.log(JSON.stringify(response, null, 2));
  return res.json(response);
}

async function saveEvent(req, res){


}

module.exports = {
  getEvents,
  saveEvent
}