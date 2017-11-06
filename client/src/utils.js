import _ from 'lodash';
import moment from 'moment';

export function getQuarterDays(date, weekday = 7) {
  let currentDay = moment(date).startOf('quarter');
  if (currentDay.isoWeekday() > weekday) {
    currentDay = currentDay.add(1, 'w');
  }
  currentDay = currentDay.isoWeekday(weekday);

  let result = [];
  const thisQuarter = currentDay.quarter();
  while (thisQuarter === currentDay.quarter()) {
    result.push(currentDay.clone());
    currentDay.add(7, 'd');
  }
  return result;
}

export function getRoles(eventData) {
  return _.reduce(
    eventData,
    (roles, item) => _.union(roles, _.map(item.members, 'role')),
    []
  );
}

export function getQuarterFirstMonth(date) {
  return moment(date)
    .startOf('quarter');
}

export function getQuarterLastMonth(date) {
  return moment(date)
    .endOf('quarter');
}