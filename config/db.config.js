require("dotenv").config()
const mongoose = require("mongoose")
const MONGODB_URI = process.env.MONGODB_URI

const connectDB = async () => {
    try{
        await mongoose.connect(MONGODB_URI)
        console.log("Database connection established sucessfully");
    }catch(err){
        process.exit(1)
        console.log(err);
    }
}

module.exports = connectDB;