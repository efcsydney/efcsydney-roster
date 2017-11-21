const Sequelize = require('sequelize');
const Event = require('../models/event').Event;
const CalendarDate = require('../models/calendar-date').CalendarDate;
const Position = require('../models/position').Position;

const Op = Sequelize.Op;

class EventRepository {
  static getEventsByDateRange(dateRange) {
    const { from, to } = dateRange;
    return Event.findAll({
      include: [
        {
          model: CalendarDate,
          as: 'calendarDate',
          where: { date: { [Op.gte]: from, [Op.lte]: to } }
        },
        { model: Position, as: 'position', required: false }
      ],
      order: [
        [{ model: CalendarDate, as: 'calendarDate' }, 'date', 'DESC'],
        [{ model: Position, as: 'position' }, 'name', 'ASC']
      ]
    });
  }

  static getEventByDatePosition(criteria) {
    const { date, position } = criteria;
    return Event.findOne({
      include: [
        {
          model: CalendarDate,
          as: 'calendarDate',
          where: { date: { [Op.eq]: date } }
        },
        {
          model: Position,
          as: 'position',
          where: { name: position },
          required: true
        }
      ],
      order: [
        [{ model: CalendarDate, as: 'calendarDate' }, 'date', 'DESC'],
        [{ model: Position, as: 'position' }, 'name', 'ASC']
      ]
    });
  }

  static findOrCreateCalendarDate(date) {
    return CalendarDate.findOrCreate({
      where: { date: date },
      defaults: { date: date }
    });
  }

  static findOrCreatePosition(position) {
    return Position.findOrCreate({
      where: { name: position }
    });
  }

  static addEvent(event) {
    const calendarDatePromise = EventRepository.findOrCreateCalendarDate(
      event.calendarDate.date
    );
    const positionPromise = EventRepository.findOrCreatePosition(
      event.position.name
    );

    return Promise.all([calendarDatePromise, positionPromise]).then(function(
      results
    ) {
      const [calendarDateResult, positionResult] = results;
      const calendarDate = calendarDateResult[0];
      const position = positionResult[0];
      return Event.create({
        volunteerName: event.volunteerName,
        calendarDateId: calendarDate.id,
        positionId: position.id
      });
    });
  }

  static updateEvent(event) {
    return Event.update(
      {
        volunteerName: event.volunteerName
      },
      {
        where: { id: event.id }
      }
    );
  }
}

module.exports = { EventRepository };
