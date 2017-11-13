const Sequelize = require('sequelize');
const Event = require('../models/event').Event;
const Calendar = require('../models/calendar').Calendar;
const Position = require('../models/position').Position;

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
    let calendarPromise = Calendar.findOrCreate({
      where: { date: event.calendar.date },
      defaults: { date: event.calendar.date }
    });
    let positionPromise = Position.findOrCreate({
      where: { name: event.position.name }
    });

    return Promise.all([calendarPromise, positionPromise])
    .then(function(results){
      const [calendarResult, positionResult] = results;
      const calendar = calendarResult[0];
      const position = positionResult[0];
      return Event.create({
        volunteerName: event.volunteerName,
        calendarId: calendar.id,
        positionId: position.id
      });
    });
  };
}

module.exports = { Repository };