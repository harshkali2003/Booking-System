const winston = require("winston");

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const logFormat = winston.format.printf(
  (info) => `${info.timestamp} [${info.level}]: ${info.message}`
);

const format = winston.format.combine(
  winston.format.timestamp({
    format: "YYYY-MM-DD HH:mm:ss.SSS",
  }),
  logFormat
);

const transports = [
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({
        format: "YYYY-MM-DD HH:mm:ss.SSS",
      }),
      logFormat
    ),
  }),

  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),

  new winston.transports.File({
    filename: "logs/combined.log",
  }),
];

const logger = winston.createLogger({
  level: "debug",
  levels,
  format,
  transports,

  exceptionHandlers: [
    new winston.transports.File({
      filename: "logs/exceptions.log",
    }),
  ],

  rejectionHandlers: [
    new winston.transports.File({
      filename: "logs/rejections.log",
    }),
  ],
});

module.exports = logger;