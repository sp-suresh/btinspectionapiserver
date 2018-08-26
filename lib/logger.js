var winston = require("winston");
var customLevels = {
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    verbose: 3,
    debug: 4,
    silly: 5
  },
  colors: {
    error: "red",
    warn: "yellow",
    info: "blue",
    verbose: "white",
    debug: "white",
    silly: "white"
  }
};
winston.addColors(customLevels.colors);
var logger = new(winston.Logger)({
  transports: [
    new(winston.transports.Console)({
      handleException: true,
      humanReadableUnhandledException: true,
      colorize: true,
      timestamp: true,
      level: "silly",
      prettyPrint: true
    })
  ],
  levels: customLevels.levels,
  exitOnError: false
});

module.exports = {
  error : logger.error,
  warn : logger.warn,
  info : logger.info,
  debug : logger.debug,
  silly : logger.silly,
  verbose : logger.verbose
};
