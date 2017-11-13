const moment = require('moment');
const dateTimeFormat = require('../constants/datetime').dateTimeFormat;

class EventService{
  static computeDateRange(dateRange){
    const {from, to} = dateRange;
    if(from === undefined){
      from = new Date();
    }
    const rangeFrom = moment(from, dateTimeFormat.stringFormat);

    const rangeTo = (to !== undefined) ?
      moment(to, dateTimeFormat.stringFormat) : 
      moment(from, dateTimeFormat.stringFormat).add(12, "weeks");

    return {from: rangeFrom.toDate(), to: rangeTo.toDate()};
  }
}

module.exports = { EventService }