const Sequelize = require('sequelize');
const ServiceCalendarDate = require('../models/service-calendar-date')
  .ServiceCalendarDate;
const CalendarDate = require('../models/calendar-date').CalendarDate;
const Service = require('../models/service').Service;

const Op = Sequelize.Op;

class ServiceCalendarDateRepository {
  static getServiceInfoByDateRange(dateRange, service) {
    const { from, to } = dateRange;

    return ServiceCalendarDate.findAll({
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

  static updateServiceInfo(serviceInfo) {
    return ServiceCalendarDate.update(
      {
        footnote: serviceInfo.footnote,
        skipService: serviceInfo.skipService,
        skipReason: serviceInfo.skipReason,
      },
      {
        where: { id: serviceInfo.id }
      }
    );
  }
}

module.exports = {
  ServiceCalendarDateRepository
};
