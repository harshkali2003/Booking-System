const asyncHandler = require("../../common/utils/asyncWrapper");

const { createShowService, getShowService } = require("./show.service");

exports.createShow = asyncHandler(async (req, resp, next) => {
  const user = req.user;

  const { movieId, screen, timing, totalSeats } = req.body;

  const show = await createShowService(
    user,
    movieId,
    screen,
    timing,
    totalSeats,
  );

  return resp.status(201).json({
    success: true,
    message: "Show created",
    data: show,
  });
});

exports.getShow = asyncHandler(async (req, resp, next) => {
  const { movieId, screen, timing, page, limit } = req.query;

  const shows = await getShowService(movieId, screen, timing, page, limit);

  return resp.status(200).json({
    success: true,
    message: "Shows fetched successfully",
    data: shows,
  });
});
