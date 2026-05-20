const morgan = require("morgan");
const logger = require("../logger/logger");

const morganMiddleware = morgan("dev", {
  stream: {
    write: (message) => {
      logger.http(message.trim());
    },
  },
});

module.exports = morganMiddleware;