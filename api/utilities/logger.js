const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');
winston.emitErrs = true;

const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new winston.Logger({
  transports: [
    new winstonDailyRotateFile({
      filename: 'log/-results.log',
      timestamp: tsFormat,
      datePattern: 'yyyy-MM-dd',
      prepend: true
    }),
    new winston.transports.Console({
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true
    })
  ],
  exitOnError: false
});

module.exports = logger;
module.exports.stream = {
  write: function(message, encoding) {
    logger.info(message);
  }
};
