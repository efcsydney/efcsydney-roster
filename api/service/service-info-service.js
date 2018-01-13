const moment = require('moment');
const ServiceCalendarDateRepository = require('../data/service-calendar-date-repository').ServiceCalendarDateRepository;
const log = require('winston');
const getDateString = require('../utilities/datetime-util').getDateString;

class ServiceInfoService {
  static async saveFootnote(footnote) {

    return ServiceCalendarDateRepository.updateServiceFootnote(footnote);
  }
}

module.exports = { ServiceInfoService };