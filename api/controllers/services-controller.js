const mockData = require('./services-mock.json');

/**
 * Get Events
 */
async function getServices(req, res) {
  res.json(mockData);
}

module.exports = {
  getServices
};
