process.env.TZ = 'Australia/Sydney';

require('./newrelic');
const app = require('./app').app;
const logger = require('winston');

app.listen(app.get('port'), () => {
  logger.info(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
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