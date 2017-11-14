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

  static getEventByDatePosition(criteria){
    const {date, position} = criteria;
    return Event.findOne({
      include: [
        { model: Calendar, as: 'calendar', where: { date: {[Op.eq]: date}}},
        { model: Position, as: 'position', where: { name: position} }],
      order: [
        [Calendar, "date", "DESC" ]
      ]
    })
  }

  static findOrCreateCalendarDate(date){
    return Calendar.findOrCreate({
      where: { date: date },
      defaults: { date: date }
    });
  }

  static findOrCreatePosition(position){
    return Position.findOrCreate({
      where: { name: position }
    });
  }

  static saveEvent(event){
    const calendarPromise = Repository.findOrCreateCalendarDate(event.calendar.date);
    const positionPromise = Repository.findOrCreatePosition(event.position.name);

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

  static updateEvent(event){
    const calendarPromise = Repository.findOrCreateCalendarDate(event.calendar.date);
    const positionPromise = Repository.findOrCreatePosition(event.position.name);

    return Promise.all([calendarPromise, positionPromise])
    .then(function(results){
      const [calendarResult, positionResult] = results;
      const calendar = calendarResult[0];
      const position = positionResult[0];
      return Event.update({
        volunteerName: event.volunteerName
      },{
        where: {calendarId: calendar.id, positionId: position.id }
      });
    });
  }
}

module.exports = { Repository };