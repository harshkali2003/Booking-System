const { Worker } = require("bullmq");

const Seat = require("../modules/seat/seat.model");
const Booking = require("../modules/booking/booking.model");
const AppError = require("../common/utils/global.error");

const worker = new Worker(
  "bookingQueue",
  async (job) => {
    const { bookingId } = job.data;
    console.log(`processing booking : ${bookingId}`);

    const booking = await Booking.findById(bookingId);
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
      },
    );

    console.log(`Booking confirmed: ${bookingId}`);
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
