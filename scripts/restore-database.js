const log = require('../api/utilities/logger');
const dbUtil = require('../api/utilities/database-util');

const dateString = process.argv[2];

const BACKUP_DATE_REGEX = /^\d{4}\d{2}\d{2}$/;

if (!dateString) {
  log.error('Date [YYYYMMDD] argument is required. e.g. yarn db-restore 20180201');
  return
}

if (!dateString.match(BACKUP_DATE_REGEX)) {
  log.error(`Invalid date string detected: ${dateString}. A pattern of YYYYMMDD is required`);
  return;
}

dbUtil.restoreDatabase(dateString);