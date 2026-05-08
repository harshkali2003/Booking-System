require("dotenv").config()
const redis = require("redis")

const redisClient = redis.createClient({
    url : process.env.REDIS_URL
})

redisClient.on("connect" , () => {
    console.log("redis connected")
})

redisClient.on("error" , (err) => {
    console.log("error : " , err)
})

const connectRedis = async () => {
    await redisClient.connect()
}

module.exports = {redisClient , connectRedis}