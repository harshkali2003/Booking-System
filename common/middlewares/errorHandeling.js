require("dotenv").config()

const ErrorHandler = (err , req , resp , next) => {
    console.log(err || err.message);
    
    const message = err.message
    const statusCode = err.statusCode

    return resp.status(statusCode).json({
        success : false,
        message : message,
        ...(process.env.NODE_ENV === "development" && {stack : err.stack})
    })
} 

module.exports = ErrorHandler;