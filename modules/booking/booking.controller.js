const {confirmBookingService} = require("./booking.service")
const asyncHandler = require("../../common/utils/asyncWrapper")

exports.confirmBookibg = asyncHandler(async (req , resp , next) => {
    const userId = req.user._id;
    const {showId} = req.params;

    const booking = await confirmBookingService(showId , userId)

    resp.status(200).json({
        success : true,
        message : "Booking confirmed",
        data : booking,
    })
})