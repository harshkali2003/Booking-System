require("dotenv").config();

const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger.config");

const connectDB = require("./config/db.config");
const { connectRedis } = require("./config/redis.config");
const {
  publicLimit,
  authLimit,
  paymentLimit,
} = require("./common/middlewares/rateLimit.middleware");
const morganMiddleware = require("./common/middlewares/requestLogger.middleware");

const app = express();

app.set("trust proxy", 1);

app.use(express.json());

app.use(morganMiddleware);

app.use(publicLimit);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT;

const startServer = async () => {
  try {
    await connectDB();
    await connectRedis();

    require("./workers/booking.worker");

    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  } catch (err) {
    console.log("Server startup failed:", err);
  }
};

app.get("/health", (req, resp) => {
  resp.status(200).json({
    success: true,
    message: "Server is healthy",
  });
});

startServer();
