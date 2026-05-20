require("dotenv").config();

const express = require("express");

const connectDB = require("./config/db.config");
const { connectRedis } = require("./config/redis.config");
const {publicLimit , authLimit , paymentLimit} = require("./common/middlewares/rateLimit.middleware")
const morganMiddleware = require("./common/middlewares/requestLogger.middleware")

const app = express();

app.set("trust proxy" , 1);

app.use(express.json());

app.use(publicLimit)

app.use(morganMiddleware)

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