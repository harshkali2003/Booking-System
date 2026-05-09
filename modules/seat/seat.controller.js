const asyncHandler = require("../../utils/asyncHandler");
const {
  getAvailableSeatService,
  lockSeatService,
} = require("./seat.service");

exports.getAvailableSeat = asyncHandler(async (req, resp) => {
  const { showId } = req.params;

  const seats = await getAvailableSeatService(showId);

  return resp.status(200).json({
    success: true,
    message: "Fetched available seats",
    totalAvailableSeats: seats.length,
    data: seats,
  });
});

exports.lockSeat = asyncHandler(async (req, resp) => {
  const user = req.user;

  const { seats } = req.body;
  const { showId } = req.params;

  const seatDetails = await lockSeatService({
    user,
    seats,
    showId,
  });

  return resp.status(200).json({
    success: true,
    message: "Seat locked successfully",
    data: seatDetails,
  });
});