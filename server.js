process.env.TZ = 'Australia/Sydney';

require('./newrelic');
const app = require('./app').app;
const logger = require('./api/utilities/logger');
const databaseUtil = require('./api/utilities/database-util');

const ports = [app.get('port'), app.get('secure-port')];
ports.forEach(port => {
  app.listen(port, () => {
    logger.info(`Find the server at: http://localhost:${port}/`);
  })
});

// cron job for scheduled email
const config = require('config');
const CronJob = require('cron').CronJob;
const reminderEmail = require('./api/service/send-email-service').reminderEmail;

new CronJob(config.get('reminderEmail.schedule'), async function() {
    try {
      if (config.get('reminderEmail.enabled')) {
        logger.debug('try to send scheduled email');
        await reminderEmail();
      }
    } catch (error) {
      logger.error(error);
    }
  }, function () {
    logger.debug('scheduler stop');
  },
  true, /* Start the job right now */
  'Australia/Sydney'
);

new CronJob(config.get('databaseBackup.schedule'), async function() {
    databaseUtil.backupDatabase();
  }, function() {
    logger.debug('database backup stopped');
  },
  true,
  'Australia/Sydney'
);