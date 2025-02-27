const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const { FLIGHT_SERVICE } = require("../config/server-config");
const { Enums } = require("../utils/commons");
const { BOOKED } = Enums.BOOKING_STATUS;
const bookingRepository = new BookingRepository();

async function createBooking(data) {
  const transaction = await db.sequelize.transaction();
  try {
    // MANAGED TRANSACTION

    // const result = await db.sequelize.transaction(async (t) => {
    //   console.log("Fetching flight details for flightId:", data.flightId);

    //   // Fetch flight details
    //   const flightResponse = await axios.get(`${FLIGHT_SERVICE}/api/v1/flight/${data.flightId}`);
    //   const flight = flightResponse.data.data;
    //   if(data.noOfSeats > flight.totalSeats){
    //     const error = new Error(
    //         "Not enough seats avaible"
    //       );
    //       error.name = "CustomError";
    //       throw error;
    //   }

    //   console.log("Flight Details:", flight);

    //   return flight;
    // });
    // return result;

    const { flightId, userId, noOfSeats } = data;
    const flightResponse = await axios.get(
      `${FLIGHT_SERVICE}/api/v1/flight/${data.flightId}`
    );
    const flight = flightResponse.data.data;
    if (data.noOfSeats > flight.totalSeats) {
      const error = new Error("Not enough seats avaible");
      error.name = "CustomError";
      throw error;
    }

    const totalBillingAmount = noOfSeats * flight.price;
    console.log(totalBillingAmount);
    const bookingPayload = { ...data, totalCost: totalBillingAmount };
    const booking = await bookingRepository.createBooking(
      bookingPayload,
      transaction
    );

    const updateSeatsResponse = await axios.patch(
      `${FLIGHT_SERVICE}/api/v1/flight/${flightId}/seats`,
      {
        seats: noOfSeats,
      }
    );
    console.log(updateSeatsResponse.data.data);
    await transaction.commit();
    return booking;
  } catch (error) {
    transaction.rollback();
    console.error("Transaction failed:", error.message);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const explanation = error.errors.map((err) => err.message);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name === "CustomError") {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }

    throw new AppError(
      "Cannot create Booking",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function makePayment(data) {
  const transaction = await db.sequelize.transaction();
  try {
    const { bookingId, userId, totalCost } = data;
    const bookingDetails = await bookingRepository.getUsingT(
      bookingId,
      transaction
    );

    if (bookingDetails.totalCost !== totalCost) {
      const error = new Error("The ammount of the payment don't match");
      error.name = "CustomError";
      throw error;
    }

    if (bookingDetails.userId !== userId) {
      const error = new Error(
        "The user corresponding to the booking doesn't match"
      );
      error.name = "CustomError";
      throw error;
    }

    const updateBooking = await bookingRepository.updateUsingT(bookingId, {
      status: BOOKED,
    }, transaction);

    const updatedBookingDetails = await bookingRepository.getUsingT(
        bookingId,
        transaction
      );
    await transaction.commit();

    return updatedBookingDetails;

  } catch (error) {
    transaction.rollback();
    console.error("makepayment failed:", error.message);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      const explanation = error.errors.map((err) => err.message);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name === "CustomError") {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }

    throw new AppError(
      "Cannot create Booking",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createBooking,
  makePayment,
};
