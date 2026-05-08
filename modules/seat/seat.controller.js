const mongoose = require("mongoose");
const Seat = require("./seat.model");
const Show = require("../show/show.model");
const { redisClient } = require("../../config/redis.config");

exports.getAvailableSeat = async (req, resp, next) => {
  try {
    const { showId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(showId)) {
      return next(new Error("invalid show id"));
    }

    const show = await Show.findById(showId);

    if (!show) {
      return next(new Error("Show not found"));
    }

    const seats = await Seat.find({ showId, isBooked: false })
      .select("seatNumber price")
      .sort({ seatNumber: 1 });

    if (seats.length === 0) {
      return next(new Error("No available setas"));
    }

    return resp.status(200).json({
      success: true,
      message: "fetched available setas",
      totalAvailableSeats: seats.length,
      data: seats,
    });
  } catch (err) {
    return next(err);
  }
};

exports.lockSeat = async (req, resp, next) => {
  try {
    const user = req.user;
    if (!user) {
      return next(new Error("Login first"));
    }

    const { seats } = req.body;
    if (!seats || seats.length === 0) {
      return next(new Error("seats are empty"));
    }

    const seatDocs = await Seat.find({ seatNumber: { $in: seats } });

    if (seatDocs.length !== seats.length) {
      return next(new Error("Some seats are booked"));
    }

    for (const seat of seatDocs) {
      if (seat.isBooked) {
        return next(new Error(`Seat ${seat.seatNumber} is already booked`));
      }
    }

    const expiryTime = new Date(Date.now() + 5 * 60 * 1000);

    for (const seat of seatDocs) {
      const lockKey = `seat-${seat.seatNumber}`;

      const lockSeat = await redisClient.set(lockKey, user._id.toString(), {
        NX: true,
        EX: 300,
      });

      if (!lockSeat) {
        return next(new Error(`Seat ${seat.seatNumber} is already locked`));
      }

      await Seat.updateOne(
        {
          seatNumber: seat.seatNumber,
        },
        {
          $set: {
            isLocked: true,
            lockedBy: user._id,
            lockExpiresAt: expiryTime,
          },
        },
      );
    }

    const seatDetails = await Seat.find({ seatNumber: { $in: seats } });

    return resp.status(200).json({
      success: true,
      message: "Seat locked",
      data: seatDetails,
    });
  } catch (err) {
    return next(err);
  }
};
