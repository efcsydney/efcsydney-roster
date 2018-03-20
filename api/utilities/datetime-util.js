const moment = require('moment');

function getDateString(date) {
  const dateInMoment = moment(date);
  return dateInMoment.format().slice(0, 10);
}

/**
 * Get new date string by weeks
 *
 * @method getDateByWeeks
 * @param dateString {String} '2017-10-12'
 * @param week {Integer} 2
 * @return {String} '2017-10-26'
 */
function getDateByWeeks(from, weeks) {
  const date = new Date(from);
  date.setDate(date.getDate() + 7 * weeks);
  return getDateString(date);
}

function addByMonth(date, month){
  return moment(date).add(month);
}

module.exports = {
  getDateString,
  getDateByWeeks,
  addByMonth
};
