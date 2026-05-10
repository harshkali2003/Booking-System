const mongoose = require("mongoose");
const Booking = require("./booking.model");
const Seat = require("../seat/seat.model");
const AppError = require("../../common/utils/global.error");
const {redisClient} = require("../../config/redis.config")

exports.confirmBookingService = async (showId, userId) => {
  if (
    !mongoose.Types.ObjectId.isValid(showId) ||
    !mongoose.Types.ObjectId.isValid(userId)
  ) {
    throw new AppError("Not a valid ID", 400);
  }

  const isLocked = await Seat.find({
    $and: [{ showId }, { lockedBy: userId }, { isLocked: true }],
  });

  if (!isLocked || isLocked.length === 0) {
    throw new AppError("Seats are not locked", 400);
  }

  let totalPrice = 0;
  let seatNumber = [];
  for (const seat of isLocked) {
    totalPrice += seat.price;
    seatNumber.push(seat.seatNumber);
  }

  const booking = await Booking.create({
    showId,
    userId,
    seats: seatNumber,
    totalPrice: totalPrice,
    bookingStatus: "CONFIRMED",
  });

  await Seat.updateMany(
    {
      showId,
      lockedBy: userId,
      isLocked: true,
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

  for(const seat of isLocked){
    const lockKey = `show:${showId}seat:${seat.seatNumber}`

    await redisClient.del(lockKey)
  }

  return booking;
};
