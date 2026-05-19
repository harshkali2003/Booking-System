const { Worker } = require("bullmq");

const Seat = require("../modules/seat/seat.model");
const Booking = require("../modules/booking/booking.model");
const AppError = require("../common/utils/global.error");
const mongoose = require("mongoose");

const worker = new Worker(
  "bookingQueue",
  async (job) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { bookingId } = job.data;
      console.log(`processing booking : ${bookingId}`);

      const booking = await Booking.findById(bookingId).session(session);
      if (!booking) {
        throw new AppError("booking not found", 404);
      }

      await Seat.updateMany(
        {
          seatNumber: { $in: booking.seats },
          showId: booking.showId,
        },
        {
          $set: {
            isBooked: true,
            isLocked: false,
            lockedBy: null,
            lockExpiresAt: null,
          },
        },
        {
          session,
        },
      );

      await Booking.findOneAndUpdate(
        {
          _id: bookingId,
        },
        {
          $set: {
            bookingStatus: "CONFIRMED",
          },
        },
        {
          new: true,
          session,
        },
      );

      console.log(`Booking confirmed: ${bookingId}`);
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      await session.endSession();
    }
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
  },
);

worker.on("completed", (job) => {
  console.log(`job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job failed: ${err.message}`);
});
