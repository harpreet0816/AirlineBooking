const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/commons");
const AppError = require("../utils/errors/app-error");

const inMemDB = {};

const test = async (req, res) => {
  console.log(req.body);
  const d = await BookingService.cancelOldBookings();
  res.json({ done: "fs" });
};

const createBooking = async (req, res, next) => {
  try {
    const booking = await BookingService.createBooking({
      flightId: req.body.flightId,
      userId: req.body.userId,
      noOfSeats: req.body.noOfSeats,
    });
    SuccessResponse.message = "Successfully booked a Flight";
    SuccessResponse.data = booking;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.warn("createBooking", error.message);
    error.statusCode = error.statusCode || 500;
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
};

const makePayment = async (req, res, next) => {
  try {
    const idempotencyKey = req.headers["x-idempotency-key"];

    if (!idempotencyKey || inMemDB[idempotencyKey]) {
      const error = new Error(
        !idempotencyKey
          ? "Idempotency key is missing"
          : "Cannot retry on a successful payment"
      );
      error.explanation = !idempotencyKey
        ? "Idempotency key is missing"
        : "Cannot retry on a successful payment";
      error.statusCode = StatusCodes.BAD_GATEWAY;
      throw error;
    }

    const makePayment = await BookingService.makePayment({
      bookingId: req.body.bookingId,
      userId: req.body.userId,
      totalCost: req.body.totalCost,
    });

    SuccessResponse.message = "Successfully booked a Flight after payment";
    SuccessResponse.data = makePayment;

    inMemDB[idempotencyKey] = idempotencyKey;

    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.warn("make payment", error.message);
    error.statusCode = error.statusCode || 500;
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
};

module.exports = {
  test,
  createBooking,
  makePayment,
};
