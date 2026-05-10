const express = require("express")
const router = express.Router()

const Booking = require("./booking.controller")

router.post("/:showId" , Booking.confirmBookibg)

module.exports = router;