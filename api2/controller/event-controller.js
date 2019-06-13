const { getEvents: get } = require('../services/event-service');

/**
 * Get Events
 *
 * @param from {String} query string for date range, eg. '2017-01-01'
 * @param to? {String} query string for date range, eg. '2017-02-01'
 * @param category: query string
 */
async function getEvents(req, res, next) {
  try {
    const data = await get();

    res.json(data);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getEvents
};
