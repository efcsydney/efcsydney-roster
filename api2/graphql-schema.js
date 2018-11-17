const { buildSchema } = require('graphql');
const { getEvents } = require('./services/event-service');

// GraphQL schema
const schema = buildSchema(`
    type Query {
      events: [Event]
    },
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
    },
    type Service {
      id: Int,
      name: String,
      locale: String,
      footnoteLabel: String,
      slug: String
    },
    type Position {
      id: Int,
      name: String,
      order: Int,
      eventPosition: EventPosition
    },
    type EventPosition {
      id: Int,
      name: String
    }
`);
// Root resolver
const root = {
  events: () => {
    return getEvents().then(events => events);
  }
};

module.exports = {
  schema,
  root
};
