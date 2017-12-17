const moment = require('moment');

function getDateString(date) {
  const dateInMoment = moment(date);
  return dateInMoment.format().slice(0, 10);
}

module.exports = {
  getDateString
};
