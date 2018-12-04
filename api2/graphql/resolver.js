const { Query: EventQuery } = require('./event/resolver');

module.exports = {
  Query: {
    ...EventQuery
  }
};
