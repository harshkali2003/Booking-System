const mongoose = require("mongoose");
const Show = require("./show.model");
const Movie = require("../movie/movie.model");

exports.createShow = async (req, resp, next) => {
  try {
    const user = req?.user;
    if (!user) {
      return next(new Error("Login first"));
    }

    const { movieId, screen, timing, totalSeats } = req.body;
    if (!movieId || !screen || !timing || !totalSeats) {
      return next(new Error("All fields are required"));
    }

    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      return next(new Error("movie id is not valid"));
    }

    const movie = await Movie.findById(movieId);

    if (!movie) {
      return next(new Error("Movie not found"));
    }

    const shows = await Show.create({
      movieId,
      screen,
      timing,
      totalSeats,
    });

    return resp.status(201).json({
      success: true,
      message: "Show created",
      data: shows,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getShow = async (req, resp, next) => {
  try {
    const { movieId, screen, timing, page = 1, limit = 10 } = req.query;
    const filter = {};

    if (movieId) {
      if (!mongoose.Types.ObjectId.isValid(movieId)) {
        return next(new Error("Invalid movie id"));
      }
      filter.movieId = movieId;
    }

    if (screen) {
      filter.screen = screen;
    }

    if (timing) {
      filter.timing = timing;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);

    const skip = (pageNum - 1) * limitNum;

    const shows = await Show.find(filter)
      .populate("movieId")
      .skip(pageNum)
      .sort({ createdAt: -1 });

    if(shows.length === 0){
      return next(new Error("No show found"))
    }

    return resp.status(200).json({
      success: true,
      message: "show has been fetched",
      data: shows,
    });
  } catch (err) {
    return next(err);
  }
};
