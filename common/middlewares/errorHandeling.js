require("dotenv").config()
const logger = require("../logger/logger")

const ErrorHandler = (err , req , resp , next) => {
    console.log(err || err.message);
    
    const message = err.message
    const statusCode = err.statusCode

    logger.error(`${req.method} ${req.originalUrl} ${req.message}`)

    return resp.status(statusCode).json({
        success : false,
        message : message,
        ...(process.env.NODE_ENV === "development" && {stack : err.stack})
    })
} 

module.exports = ErrorHandler;