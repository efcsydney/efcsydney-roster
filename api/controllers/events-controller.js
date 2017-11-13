const Event = require('../models/event').Event;
const Calendar = require('../models/calendar').Calendar;
const Position = require('../models/position').Position;
const Repository = require('../data/repository').Repository;
const EventService = require("../service/events-service").EventService;
const DataMapper = require("../mapper/model-mapper").ModelMapper;

async function getEvents(req, res) {
  const dateRange = EventService.computeDateRange(req.query.from, req.query.to);
  const events = await Repository.getEventsByDateRange(dateRange.from, dateRange.to);
  const dto = DataMapper.convertEventsModelToDto(events);

  const response = {
    success: true,
    error: { message: ""},
    data: dto
  }

  console.log(JSON.stringify(response, null, 2));
  return res.json(response);
}

module.exports = {
  getEvents
}