const Sequelize = require('sequelize');
const Event = require('../models/event').Event;
const Calendar = require("../models/calendar").Calendar;
const Position = require("../models/position").Position;

const Op = Sequelize.Op;

class Repository {
  static getEventsByDateRange(inclusiveStartDate, inclusiveEndDate){
    return Event.findAll({
      include: [
        { model: Calendar, as: 'calendar', where: { date: {[Op.gte]: inclusiveStartDate, [Op.lte]: inclusiveEndDate}} },
        { model: Position, as: 'position' }],
      order: [
        [Calendar, "date", "DESC" ] 
      ]
    });
  }

  static saveEvent(event){
    let calendarPromise = Calendar.findOrBuild({where: {date: event.calendar.date}, 
      defaults: {date: event.calendar.date, createdAt: new Date(), updatedAt: new Date()}});
    let positionPromise = Position.findOrBuild({where: {name: event.position.name}, 
      defaults: {createdAt: new Date(), updatedAt: new Date()}});

    return Promise.all([calendarPromise, positionPromise]).then(function(values){
      console.log(values); 
      let calendar = values[0];
      let position = values[1];

      let newEvent = Event.build({volunteerName: event.volunteerName,
        calendar: calendar, 
        position: position,
        default: {
        createdAt: new Date(),
        updatedAt: new Date()}});

      return newEvent.save();
    });
  };
}

module.exports = { Repository };