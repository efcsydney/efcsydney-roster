import moment from 'moment';

export function isHighlighted(dateString, frequency, today = moment()) {
  const dateFormat = 'YYYY-MM-DD';
  if (frequency === 'Month') {
    if (today.format(dateFormat) === moment(dateString).startOf('month')) {
      return true;
    } else {
      return (
        today
          .add(1, 'month')
          .startOf('month')
          .format(dateFormat) === dateString
      );
    }
  } else {
    const isoWeekday = moment(dateString).isoWeekday();
    const highlightDate = today.isoWeekday(isoWeekday).format('YYYY-MM-DD');

    return dateString === highlightDate;
  }
}
