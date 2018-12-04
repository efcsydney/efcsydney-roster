const Base = require('../base');

const Service = `
type Service {
  id: Int,
  name: String,
  locale: String,
  footnoteLabel: String,
  slug: String
}
`;

module.exports = () => [Service, Base];
