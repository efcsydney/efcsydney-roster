const Base = require('./base');
const Position = require('./position/schema');
const Service = require('./service/schema');
const EventPosition = require('./event-position/schema');
const Event = require('./event/schema');
const resolvers = require('./resolver');
const { makeExecutableSchema } = require('graphql-tools');

module.exports = makeExecutableSchema({
  typeDefs: [Base, Position, Service, EventPosition, Event],
  resolvers
});
