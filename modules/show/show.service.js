const mongoose = require("mongoose");

const Show = require("./show.model");
const Movie = require("../movie/movie.model");

const AppError = require("../../common/utils/global.error");
const { redisClient } = require("../../config/redis.config");

exports.createShowService = async (
  user,
  movieId,
  screen,
  timing,
  totalSeats
) => {

  if (!user) {
    throw new AppError("Login first", 401);
  }

  if (!movieId || !screen || !timing || !totalSeats) {
    throw new AppError("All fields are required", 400);
  }

  if (!mongoose.Types.ObjectId.isValid(movieId)) {
    throw new AppError("Movie id is not valid", 400);
  }

  const movie = await Movie.findById(movieId);

  if (!movie) {
    throw new AppError("Movie not found", 404);
  }

  const show = await Show.create({
    movieId,
    screen,
    timing,
    totalSeats,
  });

  // invalidate cache
  await redisClient.del("shows:list");

  return show;
};

exports.getShowService = async (
  movieId,
  screen,
  timing,
  page = 1,
  limit = 10
) => {

  const filter = {};

  if (movieId) {
    if (!mongoose.Types.ObjectId.isValid(movieId)) {
      throw new AppError("Invalid movie id", 400);
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

  const cacheKey = `shows:${JSON.stringify(filter)}:${pageNum}:${limitNum}`;

  // check cache
  const cachedShows = await redisClient.get(cacheKey);

  if (cachedShows) {
    console.log("Shows Cache Hit");

    return JSON.parse(cachedShows);
  }

  console.log("Shows Cache Miss");

  const shows = await Show.find(filter)
    .populate("movieId")
    .skip(skip)
    .limit(limitNum)
    .sort({ createdAt: -1 });

  if (shows.length === 0) {
    throw new AppError("No show found", 404);
  }

  // store cache
  await redisClient.set(
    cacheKey,
    JSON.stringify(shows),
    {
      EX: 60 * 5,
    }
  );

  return shows;
};