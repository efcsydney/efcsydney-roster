const Base = require('../base');
const EventPosition = require('../event-position/schema');

const Position = `
type Position {
  id: Int,
  name: String,
  order: Int,
  eventPosition: EventPosition
}
`;

module.exports = () => [Position, EventPosition, Base];
