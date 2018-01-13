const moment = require('moment');
const SerivceCalendarDate = require('../data/service-calendar-date-repository')
  .SerivceCalendarDate;
const log = require('winston');
const getDateString = require('../utilities/datetime-util').getDateString;

class ServiceInfoService {
  static async saveFootnote(footnote) {

    return SerivceCalendarDate.updateServiceFootnote(footnote);
  }
}

module.exports = { ServiceInfoService };