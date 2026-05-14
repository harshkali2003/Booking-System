const rateLimit = require("express-rate-limit");
const { RedisStore } = require("rate-limit-redis");

const { redisClient } = require("../../config/redis.config");

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message,
    },
    standardHeaders: true,
    legacyHeaders: false,
    store: new RedisStore({
      sendCommand: (...args) => redisClient.sendCommand(args),
    }),
  });
};

const authLimit = createRateLimit(
    15 * 60 * 1000,
    5,
    "Too many login attempts. Try again later."
)

const paymentLimit = createRateLimit(
    10 * 60 * 1000,
    10,
    "Too many payment requests."
)

const publicLimit = createRateLimit(
    10 * 60 * 1000,
    100,
    "Too many requests."
)

module.exports = {authLimit , paymentLimit , publicLimit};
