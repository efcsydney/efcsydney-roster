const moment = require('moment');
const dateTimeFormat = require('../constants/datetime').dateTimeFormat;

class EventService{
  static getDateRange(from, to){
    const fromDate = moment(from, dateTimeFormat.stringFormat);
    const toDate = (moment(to, dateTimeFormat.stringFormat).isValid()) ?
      moment(to, dateTimeFormat.stringFormat) : 
      fromDate.add(12, "weeks");

    return {from: fromDate.toDate(), to: toDate.toDate()};
  }
}

module.exports = { EventService }