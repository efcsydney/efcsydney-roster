const resolvers = require('./resolver');
const { makeExecutableSchema } = require('graphql-tools');

const schema = `
type Query {
  events(serviceCategory: String!, from: String, to: String): [Event],
  services: [Service]
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
type EventPosition {
  id: Int,
  name: String
}
type Position {
  id: Int,
  name: String,
  order: Int,
  eventPosition: EventPosition
}
type Service {
  id: Int,
  name: String,
  locale: String,
  footnoteLabel: String,
  slug: String,
  events: [Event],
  positions: [Position]
}
`;

module.exports = makeExecutableSchema({
  typeDefs: schema,
  resolvers
});
