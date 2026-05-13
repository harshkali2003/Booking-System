const {redisClient} = require("../../config/redis.config")

const releaseLock = async (lockKey) => {
    await redisClient.del(lockKey)
    console.log(`seat with key ${lockKey} has been released`)
}

module.exports = releaseLock;