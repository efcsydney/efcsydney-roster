const fs = require('fs');
const moment = require('moment');
const env = process.env.NODE_ENV || 'development';
const dbConfig = require(__dirname + '/../../config/database.json')[env];
const { exec } = require('child_process');
const log = require('./logger');
const config = require('config');

const BACKUP_DIR = config.get('databaseBackup.backupDirectory');

function getDateString() {
  return moment().format('YYYYMMDD');
}

function getBackupFileName() {
  return `${dbConfig.database}_${getDateString()}.sql`;
}

function ensurePathExists(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

// The command has to be in single line only. Multi-line interpolated string is seperated by
// carriage return and will cause the command fails to execute on the shell.
function getBackupQuery() {
  return `mysqldump -u ${dbConfig.username} -h ${dbConfig.host} ${dbConfig.database} > ${BACKUP_DIR}/${getBackupFileName()}`;
}

function backupDatabase() {
  ensurePathExists(BACKUP_DIR);

  log.info(`[BEGIN] DatabaseUtil#backupDatabase; file: ${getBackupFileName()}, at: ${moment()}`);

  exec(getBackupQuery(), function(err) {
    if (err) {
      log.error(`[ERROR] DatabaseUtil#backupDatabase; reason: ${err.message}`);
    } else {
      log.info(`[END] DatabaseUtil#backupDatabase; file: ${getBackupFileName()}, at: ${moment()}`);
    }
  });
}

module.exports = {
  backupDatabase
};