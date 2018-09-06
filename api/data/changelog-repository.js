const { Changelog } = require('../models/changelog');

async function createChangelog(changelog) {
  return await Changelog.create(changelog);
}

async function getChangelogs() {
  return await Changelog.findAll({
    limit: 100,
    order: [['id', 'DESC']]
  });
}
module.exports = {
  createChangelog,
  getChangelogs
};
