const Sequelize = require('sequelize');
const Event = require('../models/event').Event;
const CalendarDate = require('../models/calendar-date').CalendarDate;
const Position = require('../models/position').Position;
const Service = require('../models/service').Service;
const Footnote = require('../models/footnote').Footnote;
const Op = Sequelize.Op;

class EventRepository {
  static getEventsByDateRange(dateRange, service) {
    const { from, to } = dateRange;
    return Event.findAll({
      include: [
        {
          model: CalendarDate,
          as: 'calendarDate',
          where: { date: { [Op.gte]: from, [Op.lte]: to } }
        },
        {
          model: Position,
          as: 'position',
          required: true,
          include: [
            {
              model: Service,
              as: 'service',
              required: true,
              where: { name: { [Op.eq]: service } }
            }
          ]
        }
      ],
      order: [
        [{ model: CalendarDate, as: 'calendarDate' }, 'date', 'DESC'],
        [{ model: Position, as: 'position' }, 'order', 'ASC']
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
      ]
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
