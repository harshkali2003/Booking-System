require("dotenv").config()
const express = require("express");

const connectDB = require("./config/db.config")

const app = express()

connectDB()

app.use(express.json())

const PORT = process.env.PORT
app.listen(PORT , () => {
    console.log(`Server is running on ${PORT}`);
})