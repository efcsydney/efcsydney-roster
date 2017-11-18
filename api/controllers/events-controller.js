const Event = require('../models/event').Event;
const CalendarDate = require('../models/calendar-date').CalendarDate;
const Position = require('../models/position').Position;
const EventRepository = require('../data/event-repository').EventRepository;
const EventService = require("../service/events-service").EventService;
const EventMapper = require("../mapper/event-mapper").EventMapper;
const Factory = require('../service/factory').Factory;

async function getEvents(req, res) {
  const repository = Factory.getRepository(req);
  const dataMapper = Factory.getDataMapper(req);

  const dateRange = EventService.computeDateRange({from: req.query.from, to: req.query.to});
  const events = await repository.getEventsByDateRange({from: dateRange.from, to: dateRange.to});
  const dto = dataMapper.convertEventsModelToDto(events);

  const response = {
    success: 'OK',
    error: { message: ""},
    data: dto
  }

  console.log(JSON.stringify(response, null, 2));
  return res.json(response);
}

async function saveEvent(req, res){
  const event = EventMapper.convertDtoToEventModel(req.body.data);

  await EventService.saveEvent(event);

  const response = {
    success: 'OK',
    error: { message: ""}
  }

  return res.json(response);
}

module.exports = {
  getEvents,
  saveEvent
}