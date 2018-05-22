const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');
winston.emitErrs = true;
/*
* The source code is copied from the posts : http://tostring.it/2014/06/23/advanced-logging-with-nodejs/ and
* http://thisdavej.com/using-winston-a-versatile-logging-library-for-node-js/
*/
const tsFormat = () => new Date().toISOString();
const errorLogTransport = new winstonDailyRotateFile({
  name: 'error',
  level: 'error',
  filename: 'log/.log',
  timestamp: tsFormat,
  datePattern: 'yyyy-MM-dd',
  maxFiles: '14d',
  prepend: true
});
const debugLogTransport = new winstonDailyRotateFile({
  name: 'debug',
  level: 'debug',
  filename: 'log/.log',
  timestamp: tsFormat,
  datePattern: 'yyyy-MM-dd',
  maxFiles: '14d',
  prepend: true
});
const infoLogTransport = new winstonDailyRotateFile({
  name: 'info',
  level: 'info',
  filename: 'log/.log',
  timestamp: tsFormat,
  datePattern: 'yyyy-MM-dd',
  maxFiles: '14d',
  prepend: true
});
const consoleTransport = new winston.transports.Console({
  level: 'debug',
  handleExceptions: true,
  json: false,
  colorize: true
});

const logger = new winston.Logger({
  transports: [errorLogTransport, debugLogTransport, infoLogTransport, consoleTransport],
  exitOnError: false
});

module.exports = logger;
