const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');
winston.emitErrs = true;
/*
* The source code is copied from the posts : http://tostring.it/2014/06/23/advanced-logging-with-nodejs/ and
* http://thisdavej.com/using-winston-a-versatile-logging-library-for-node-js/
*/
const tsFormat = () => (new Date()).toLocaleTimeString();
const errorLogTransport = new winstonDailyRotateFile({
  name: 'error',
  level: 'error',
  filename: 'log/-error.log',
  timestamp: tsFormat,
  datePattern: 'yyyy-MM-dd',
  prepend: true
});
const debugLogTransport = new winstonDailyRotateFile({
  name: 'debug',
  level: 'debug',
  filename: 'log/-log.log',
  timestamp: tsFormat,
  datePattern: 'yyyy-MM-dd',
  prepend: true
})
const consoleTransport = new winston.transports.Console({
  level: 'debug',
  handleExceptions: true,
  json: false,
  colorize: true
});

const logger = new winston.Logger({
  transports: [
    errorLogTransport,
    debugLogTransport,
    consoleTransport
  ],
  exitOnError: false
});

module.exports = logger;
