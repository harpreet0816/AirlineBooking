const axios = require("axios");
const { BookingRepository } = require("../repositories");
const db = require("../models");
const { StatusCodes } = require("http-status-codes");
const AppError = require("../utils/errors/app-error");
const { FLIGHT_SERVICE } = require("../config/server-config");
const { Enums } = require("../utils/commons");
const { getFormattedTime } = require("../utils/helpers/datetime-helper");
const { BOOKED, CANCELLED } = Enums.BOOKING_STATUS;
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
      `${FLIGHT_SERVICE}/api/v1/flight/${flightId}`
    );
    const flight = flightResponse.data.data;
    if (data.noOfSeats > flight.totalSeats) {
      const error = new Error("Not enough seats avaible");
      error.name = "CustomError";
      throw error;
    }

    const totalBillingAmount = noOfSeats * flight.price;

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

    if(bookingDetails.status === CANCELLED){
      const error = new Error("The booking has been cancelled");
      error.name = "CustomError";
      throw error;
    }

    const createdBookingTime = new Date(bookingDetails.createdAt);
    const currentTime = new Date();
    const timeDifferenceInMilliseconds = Math.floor(
      currentTime - createdBookingTime
    );
    const requiredTimeInMilliseconds = 1000 * 60 * 30; //30 mins in miliseconds;
    const isWithinAllowedTime =
      timeDifferenceInMilliseconds < requiredTimeInMilliseconds;

    if (!isWithinAllowedTime) {
      await cancelBooking(bookingId);

      const error = new Error("The booking has expired");
      error.name = "CustomError";
      throw error;
    }

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

     await bookingRepository.updateUsingT(
      bookingId,
      {
        status: BOOKED,
      },
      transaction
    );

    const updatedBookingDetails = await bookingRepository.getUsingT(
      bookingId,
      transaction
    );
    await transaction.commit();

    return updatedBookingDetails;
  } catch (error) {
    await transaction.rollback();

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
      "Cannot make Payment",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function cancelBooking (bookingId) {
  const transaction = await db.sequelize.transaction();
  try {
    const bookingDetails = await bookingRepository.getUsingT(
      bookingId,
      transaction
    );

    if (bookingDetails.status === CANCELLED) {
      await transaction.commit();
      return true;
    }

    await axios.patch(`${FLIGHT_SERVICE}/api/v1/flight/${bookingDetails.flightId}/seats`, {
      seats: bookingDetails.noOfSeats,
      dec: false,
    });

    await bookingRepository.updateUsingT(
      bookingId,
      {
        status: CANCELLED,
      },
      transaction
    );

    await transaction.commit();

    return true;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

async function cancelOldBookings () {
  try {
    console.log("adjustedTime")
    const adjustedTime  = new Date( Date.now() - 1000 * 60 * 10); // time 10 mins ago
    const bookings = await bookingRepository.cancelOldBookings(adjustedTime);
    if (bookings.length > 0) {
      console.log(
        bookings[bookings.length - 1].createdAt,
        "----",
        getFormattedTime(bookings[bookings.length - 1].createdAt)
      );
    } else {
      console.log("No old bookings found.");
    }
    return bookings;
  } catch (error) {
    console.log("cancel old booking ", error.message)
  }
}

module.exports = {
  createBooking,
  makePayment,
  cancelBooking,
  cancelOldBookings
};
