const mongoose = require("mongoose");
const Seat = require("./seat.model");
const Show = require("../show/show.model");
const AppError = require("../../utils/AppError");
const { redisClient } = require("../../config/redis.config");

exports.getAvailableSeatService = async (showId) => {
  if (!mongoose.Types.ObjectId.isValid(showId)) {
    throw new AppError("Invalid show id", 400);
  }

  const show = await Show.findById(showId);

  if (!show) {
    throw new AppError("Show not found", 404);
  }

  const seats = await Seat.find({
    showId,
    isBooked: false,
  })
    .select("seatNumber price")
    .sort({ seatNumber: 1 });

  if (seats.length === 0) {
    throw new AppError("No available seats", 404);
  }

  return seats;
};

exports.lockSeatService = async ({ user, seats, showId }) => {
  if (!user) {
    throw new AppError("Login first", 401);
  }

  if (!mongoose.Types.ObjectId.isValid(showId)) {
    throw new AppError("Invalid show id", 400);
  }

  if (!seats || seats.length === 0) {
    throw new AppError("Seats are empty", 400);
  }

  const seatDocs = await Seat.find({
    showId,
    seatNumber: { $in: seats },
  });

  if (seatDocs.length !== seats.length) {
    throw new AppError("Some seats do not exist", 404);
  }

  for (const seat of seatDocs) {
    if (seat.isBooked) {
      throw new AppError(
        `Seat ${seat.seatNumber} is already booked`,
        409
      );
    }
  }

  const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

  for (const seat of seatDocs) {
    const lockKey = `show:${showId}:seat:${seat.seatNumber}`;

    const lockSeat = await redisClient.set(
      lockKey,
      user._id.toString(),
      {
        NX: true,
        EX: 300,
      }
    );

    if (!lockSeat) {
      throw new AppError(
        `Seat ${seat.seatNumber} is already locked`,
        409
      );
    }

    await Seat.updateOne(
      {
        _id: seat._id,
      },
      {
        $set: {
          isLocked: true,
          lockedBy: user._id,
          lockExpiresAt: expiryTime,
        },
      }
    );
  }

  const updatedSeats = await Seat.find({
    showId,
    seatNumber: { $in: seats },
  });

  return updatedSeats;
};