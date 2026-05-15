const express = require("express")
const router = express.Router()

const Payments = require("./payments.controller")
const idempotencyCheck = require("../../common/middlewares/idempotency.middleware")

router.post("/verify-payment/:bookingId" , idempotencyCheck , Payments.verifyOrder)

module.exports = router;