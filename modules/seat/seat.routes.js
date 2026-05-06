const express = require("express")
const router = express.Router()

const Seat = require("./seat.controller")

router.get("/seats" , Seat.getAvailableSeat)

module.exports = router;