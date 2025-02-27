const { StatusCodes } = require("http-status-codes");
const { BookingService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/commons");

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
    console.warn("createBooking", error.message)
    error.statusCode = error.statusCode || 500;
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
};

const makePayment = async (req, res, next) => {
  try {
    const makePayment = await BookingService.makePayment({
        bookingId: req.body.bookingId,
        userId: req.body.userId,
        totalCost: req.body.totalCost,
    });

    SuccessResponse.message = "Successfully booked a Flight after payment";
    SuccessResponse.data = makePayment;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    console.warn("make payment", error.message)
    error.statusCode = error.statusCode || 500;
    ErrorResponse.error = error;
    return res.status(error.statusCode || 500).json(ErrorResponse);
  }
};

module.exports = {
  createBooking,
  makePayment
};
