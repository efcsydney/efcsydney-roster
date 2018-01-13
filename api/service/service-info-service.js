const moment = require('moment');
const SerivceCalendarDateRepository = require('../data/service-calendar-date-repository').SerivceCalendarDateRepository;
const log = require('winston');
const getDateString = require('../utilities/datetime-util').getDateString;

class ServiceInfoService {
  static async saveFootnote(footnote) {

    return SerivceCalendarDateRepository.updateServiceFootnote(footnote);
  }
}

module.exports = { ServiceInfoService };