const {
  createChangelog,
  getChangelogs
} = require('../data/changelog-repository');

async function addChangelog(resourceType, req) {
  const { ip, headers, originalUrl, method: actionType } = req;
  const reqData = JSON.stringify({
    ip,
    userAgent: headers['user-agent'],
    referer: headers['referer'],
    originalUrl
  });

  return await createChangelog({
    resourceType,
    actionType,
    reqData,
    saveData: JSON.stringify(req.body)
  });
}

module.exports = {
  addChangelog,
  getChangelogs
};
