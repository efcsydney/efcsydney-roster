const Sequelize = require('sequelize');
const Footnote = require('../models/footnote').Footnote;
const CalendarDate = require('../models/calendar-date').CalendarDate;
const Service = require('../models/service').Service;

const Op = Sequelize.Op;

class FootnoteRepository {
  static getFootnotesByDateRange(dateRange, service) {
    const { from, to } = dateRange;

    return Footnote.findAll({
      include: [
        {
          model: CalendarDate,
          as: 'calendarDate',
          required: true,
          where: { date: { [Op.gte]: from, [Op.lte]: to } }
        },
        {
          model: Service,
          as: 'service',
          where: { name: { [Op.eq]: service } }
        }
      ],
      order: [[{ model: CalendarDate, as: 'calendarDate' }, 'date', 'DESC']]
    });
  }
}

module.exports = {
  FootnoteRepository
};
