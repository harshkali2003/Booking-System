const { redisClient } = require("../../config/redis.config");
const AppError = require("../utils/global.error");

const idempotencyCheck = async (req, resp, next) => {
  try {
    const idempotencykey = req.headers["x-idempotency-key"];
    if (!idempotencykey) {
      throw new AppError("Idempotency key is required", 400);
    }

    const redisKey = `idempotency${idempotencykey}`;

    const existsKey = await redisClient.get(redisKey);
    if (existsKey) {
      return resp.status(200).json({
        success: false,
        message: "Duplicate request detected",
      });
    }

    await redisClient.set(redisKey, "PROCESSING", {
      NX: true,
      EX: 60 * 10,
    });

    next();
  } catch (err) {
    return next(err);
  }
};

module.exports = idempotencyCheck