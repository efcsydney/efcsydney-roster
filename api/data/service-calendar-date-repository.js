const Sequelize = require('sequelize');
const SerivceCalendarDate = require('../models/service-calendar-date')
  .SerivceCalendarDate;
const CalendarDate = require('../models/calendar-date').CalendarDate;
const Service = require('../models/service').Service;

const Op = Sequelize.Op;

class SerivceCalendarDateRepository {
  static getServiceInfoByDateRange(dateRange, service) {
    const { from, to } = dateRange;

    return SerivceCalendarDate.findAll({
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

  static updateServiceFootnote(serviceInfo) {
    return SerivceCalendarDate.update(
      {
        footnote: serviceInfo.footnote
      },
      {
        where: { id: serviceInfo.id }
      }
    );
  }
}

module.exports = {
  SerivceCalendarDateRepository
};
