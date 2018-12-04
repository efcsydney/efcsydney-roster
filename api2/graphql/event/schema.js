// in src/user/schema.js
const Base = require('../base');
const Service = require('../service/schema');
const Position = require('../position/schema');
const EventPosition = require('../event-position/schema');
const graphql = require('graphql');

const Event = new graphql.GraphQLObjectType({
  name: 'Event',
  fields: {
    id: { type: graphql.GraphQLInt },
    date: { type: graphql.GraphQLString },
    footnote: { type: graphql.GraphQLString },
    skipReason: { type: graphql.GraphQLString },
    skipService: { type: graphql.GraphQLString },
    serviceId: { type: graphql.GraphQLInt },
    service: {
      type: Service,
      args:{
        id: { type: graphql.GraphQLInt }
      },
    positions: [Position] {
      type: Position,
      args:{
        id: { type: graphql.GraphQLInt }
      },
    eventPositions: [EventPosition]
  }
});

const Event = `
extend type Query {
  events: [Event]
}
type Event {
  id: Int,
  date: String,
  footnote: String,
  skipReason: String,
  skipService: String,
  serviceId: Int,
  service: Service,
  positions: [Position],
  eventPositions: [EventPosition]
}
`;

module.exports = () => [Event, EventPosition, Service, Position, Base];
