const fs = require('fs');
const moment = require('moment');
const env = process.env.NODE_ENV || 'development';
const dbConfig = require(__dirname + '/../../config/database.json')[env];
const { exec } = require('child_process');
const log = require('./logger');
const config = require('config');

const BACKUP_DIR = config.get('databaseBackup.backupDirectory');

function getCurrentDateString() {
  return moment().format('YYYYMMDD');
}

function getLastMonthString() {
  return moment().subtract(30, 'days').format('YYYYMMDD');
}

function getBackupFileName(date) {
  return `${dbConfig.database}_${date}.sql`;
}

function getRestoreFileName(dateString) {
  return `${dbConfig.database}_${dateString}.sql`;
}

function ensurePathExists(path) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

// The command has to be in single line only. Multi-line interpolated string is seperated by
// carriage return and will cause the command fails to execute on the shell.
function getBackupQuery(filename) {
  return `mysqldump -u ${dbConfig.username} -h ${dbConfig.host} ${dbConfig.database} > ${BACKUP_DIR}/${filename}`;
}

function getRestoreQuery(filename) {
  return `mysql -u ${dbConfig.username} -h ${dbConfig.host} ${dbConfig.database} < ${BACKUP_DIR}/${filename}`;
}

function getFileRotation(filename) {
  return `rm -y ${BACKUP_DIR}/${filename}`;
}

function backupDatabase() {
  const backupFileName = getBackupFileName(getCurrentDateString());
  const removeFileName = getBackupFileName(getLastMonthString());
  ensurePathExists(BACKUP_DIR);

  log.info(`[BEGIN] DatabaseUtil#backupDatabase; file: ${backupFileName}, at: ${moment()}`);

  exec(getBackupQuery(backupFileName), function(err) {
    if (err) {
      log.error(`[ERROR] DatabaseUtil#backupDatabase; reason: ${err.message}`);
    } else {
      log.info(`[END] DatabaseUtil#backupDatabase; Create file: ${backupFileName}, at: ${moment()}`);
    }
  });

  exec(getFileRotation(removeFileName), function(err) {
    if (err) {
      log.error(`[ERROR] DatabaseUtil#backupDatabase; reason: ${err.message}`);
    } else {
      log.info(`[END] DatabaseUtil#backupDatabase; Remove file: ${removeFileName}, at: ${moment()}`);
    }
  });
}

function restoreDatabase(dateString) {
  const restoreFileName = getRestoreFileName(dateString);

  log.info(`[BEGIN] DatabaseUtil#restoreDatabase; file: ${restoreFileName}, at: ${moment()}`);
  log.info(getRestoreQuery(restoreFileName));

  exec(getRestoreQuery(restoreFileName), function(err, stdout, stderr) {
    if (err || stderr) {
      log.error(`[ERROR] DatabaseUtil#restoreDatabase; reason: ${err.message || stderr.message}`);
    }

    if (stdout) {
      log.info(`[END] DatabaseUtil#restoreDatabase; file: ${restoreFileName}, at: ${moment()}`);
    }
  });
}

module.exports = {
  backupDatabase,
  restoreDatabase
};
