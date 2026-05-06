const mongoose = require("mongoose");

const seatSchema = new mongoose.Schema(
  {
    showId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Show",
      required: true,
    },
    seatNumber: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    isBooked : {
        type : Boolean,
        required : true,
        default : false,
    }
  },
  { timestamps: true },
);

seatSchema.index({ showId: 1 , seatNumber : 1 }, { unique: true });

module.exports = mongoose.model("Seat", seatSchema, "Seat");
