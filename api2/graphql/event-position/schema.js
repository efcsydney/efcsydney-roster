const Base = require('../base');

const EventPosition = `
type EventPosition {
  id: Int,
  name: String
}
`;

module.exports = () => [EventPosition, Base];
