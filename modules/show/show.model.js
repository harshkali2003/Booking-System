const mongoose = require("mongoose");

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref : "Movie",
    required: true,
  },
  screen : {
    type : String,
    required : true,
  },
  timing: {
    type: Date,
    required: true,
  },
  totalSeats: {
    type: Number,
    required: true,
  },
} , {timestamps : true});

showSchema.index({movieId : 1})
showSchema.index({ showTime: 1 });

module.exports = mongoose.model("Show", showSchema, "Show");
