const mongoose = require("mongoose");
const Seat = require("./seat.model");
const Show = require("../show/show.model");

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
