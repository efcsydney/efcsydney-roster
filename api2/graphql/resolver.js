const { Query: EventQuery } = require('./event/resolver');
const { Query: ServiceQuery } = require('./service/resolver');

module.exports = {
  Query: {
    ...EventQuery,
    ...ServiceQuery
  }
};
