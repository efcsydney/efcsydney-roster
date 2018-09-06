const { Changelog } = require('../models/changelog');

async function createChangelog(changelog) {
  return await Changelog.create(changelog);
}

async function getChangelogs() {
  return await Changelog.findAll();
}
module.exports = {
  createChangelog,
  getChangelogs
};
