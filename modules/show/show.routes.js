const express = require("express")
const router = express.Router()

const Show = require("./show.controller")

router.get("/shows" , Show.getShow)

router.post("/shows" , Show.createShow)

module.exports = router;