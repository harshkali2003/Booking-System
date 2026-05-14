require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db.config");
const { connectRedis } = require("./config/redis.config");
const {publicLimit , authLimit , paymentLimit} = require("./common/middlewares/rateLimit.middleware")

const app = express();

app.use(express.json());

app.use(publicLimit)

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    require("./workers/booking.worker")

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (err) {
    console.log("Server startup failed:", err);
  }
};

startServer();