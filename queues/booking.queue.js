const {Queue} = require("bullmq")

const bookingQueue = new Queue("bookingQueue" , {
    connection : {
        host : process.env.REDIS_HOST,
        port : process.env.REDIS_PORT,
    }
})

module.exports = bookingQueue;