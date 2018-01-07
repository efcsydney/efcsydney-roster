import queryString from 'query-string';
import _ from 'lodash';
import moment from 'moment';

export const sanitize = obj => {
  const query = _.clone(obj);
  _.forOwnRight(query, (val, key) => {
    if (_.isNull(val) || _.isUndefined(val) || val === '') {
      delete query[key];
    }
  });
  return query;
};

export const buildQuery = obj => queryString.stringify(sanitize(obj));

export function findEvent(events, day) {
  return _.find(
    events,
    event =>
      moment(event.date).format('YYYY-MM-DD') === day.format('YYYY-MM-DD')
  );
}

export function getCalData(day, roles, members) {
  const description = _.reduce(
    roles,
    (message, role) => {
      const member = _.find(members, { role }) || {};
      const name = member.name || '';
      if (name) {
        message.push(`${role} - ${name}`);
      }
      return message;
    },
    []
  ).join(', ');

  return {
    title: 'EFC Sydney English Service',
    description,
    location: '10 Carlotta St, Artarmon NSW 2064, Australia',
    startTime: day
      .clone()
      .hour(10)
      .minute(30)
      .toISOString(),
    endTime: day
      .clone()
      .hour(12)
      .toISOString()
  };
}

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

export function getQueryParams(qs) {
  qs = qs.split('+').join(' ');
  let params = {},
    tokens,
    re = /[?&]?([^=]+)=([^&]*)/g;
  for (let paramCount = 0; paramCount < 20; paramCount++) {
    tokens = re.exec(qs);
    if (tokens == null) {
      break;
    }
    params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
  }
  return params;
}

export function getRoles(eventData) {
  return _.reduce(
    eventData,
    (roles, item) => _.union(roles, _.map(item.members, 'role')),
    []
  );
}

export function getQuarterFirstMonth(date) {
  return moment(date).startOf('quarter');
}

export function getQuarterLastMonth(date) {
  return moment(date).endOf('quarter');
}

export function getMemberNames(events) {
  return _(events)
    .map('members')
    .flatten()
    .map('name')
    .union()
    .filter(name => !_.isEmpty(name))
    .sort()
    .value();
}
