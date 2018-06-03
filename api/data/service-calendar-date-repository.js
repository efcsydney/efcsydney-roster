const Sequelize = require('sequelize');
const ServiceCalendarDate = require('../models/service-calendar-date')
  .ServiceCalendarDate;
const CalendarDate = require('../models/calendar-date').CalendarDate;
const Service = require('../models/service').Service;
const logger = require('../utilities/logger');

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

  static async createServiceInfo(serviceInfo) {
    const { date } = serviceInfo.calendarDate;
    const { name } = serviceInfo.service;

    //get calendar date Id from calendarDate table
    let dateInDb = await CalendarDate.findOne({
      where: { date: { [Op.eq]: date } }
    });

    if (!dateInDb) {
      dateInDb = await CalendarDate.create({ date: date });
    }

    //get service
    let serviceInDb = await Service.findOne({
      where: { name: { [Op.eq]: name } }
    });

    serviceInfo.calendarDateId = dateInDb.id;
    serviceInfo.serviceId = serviceInDb.id;

    logger.info(`Date ID: ${dateInDb.id}`);
    logger.info(`Service ID: ${serviceInDb.id}`);

    return ServiceCalendarDate.create({
      footnote: serviceInfo.footnote,
      skipService: serviceInfo.skipService,
      skipReason: serviceInfo.skipReason,
      calendarDateId: serviceInfo.calendarDateId,
      serviceId: serviceInfo.serviceId
    });
  }

  static updateServiceInfo(serviceInfo) {
    return ServiceCalendarDate.update(
      {
        footnote: serviceInfo.footnote,
        skipService: serviceInfo.skipService,
        skipReason: serviceInfo.skipReason
      },
      {
        where: { id: serviceInfo.id }
      }
    );
  }

  static getServiceInfoById(serviceInfoId) {
    return ServiceCalendarDate.findById(serviceInfoId);
  }
}

module.exports = {
  ServiceCalendarDateRepository
};
