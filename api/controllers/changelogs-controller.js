const { getChangelogs } = require('../service/changelogs-service');
const { ok } = require('../utilities/response-helper');
const log = require('../utilities/logger');

async function get(req, res, next) {
  try {
    const changelogs = await getChangelogs();
    res.json(ok(changelogs));
  } catch (err) {
    log.error(err);
    next(err);
  }
}

module.exports = {
  get
};
