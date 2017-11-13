const Sequelize = require('sequelize');
const Event = require('../models/event').Event;
const Calendar = require("../models/calendar").Calendar;
const Position = require("../models/position").Position;

const Op = Sequelize.Op;

class Repository {
  static getEventsByDateRange(dateRange){
    const {from, to} = dateRange;
    return Event.findAll({
      include: [
        { model: Calendar, as: 'calendar', where: { date: {[Op.gte]: from, [Op.lte]: to}} },
        { model: Position, as: 'position' }],
      order: [
        [Calendar, "date", "DESC" ] 
      ]
    });
  }

  static saveEvent(event){
    let calendarPromise = Calendar.findOrBuild({where: {date: event.calendar.date}, 
      defaults: {date: event.calendar.date}});
    let positionPromise = Position.findOrBuild({where: {name: event.position.name}});

    return Promise.all([calendarPromise, positionPromise]).then(function(values){
      console.log(values); 
      let calendar = values[0];
      let position = values[1];

      let newEvent = Event.build({volunteerName: event.volunteerName,
        calendar: calendar, 
        position: position});

      return newEvent.save();
    });
  };
}

module.exports = { Repository };