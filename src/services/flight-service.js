const { StatusCodes } = require("http-status-codes");
const { FlightRepository } = require("../repositories");
const AppError = require("../utils/errors/app-error");
const { compareTime } = require("../utils/helpers/datetime-helper");
const { Op } = require("sequelize");

const flightRepository = new FlightRepository();

async function createFlight(data) {
  try {
    const isNotValid = compareTime(data.departureTime, data.arrivalTime);
    if (isNotValid) {
      const error = new Error(
        "Departure time must be greater than arrival time"
      );
      error.name = "CustomError"; // ✅ Custom name
      throw error;
    }
    const flight = await flightRepository.create(data);
    return flight;
  } catch (error) {
    console.warn(error.message, error.name);
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name === "CustomError") {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot create a new Flight object",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getFlights(query) {
  try {
    let customFilter = {};
    let sortFilter = [];
    if (query.trips) {
      if (!/^[A-Z]{3}-[A-Z]{3}$/.test(query.trips)) {
        const error = new Error(
          "trips must be in format XXX-XXX (e.g., MUM-BLR)"
        );
        error.name = "CustomError"; // ✅ Custom name
        throw error;
      }
      const [departureAirportId, arrivalAirportId] = query.trips.split("-");
      if (departureAirportId === arrivalAirportId) {
        const error = new Error(
          "Departure and Arrival destination cannot be same"
        );
        error.name = "CustomError";
        throw error;
      }
      customFilter.departureAirportId = departureAirportId;
      customFilter.arrivalAirportId = arrivalAirportId;
    }
    if (query.price) {
      if (!/^\d{1,7}(\.\d{1,2})?-\d{1,7}(\.\d{1,2})?$/.test(query.price)) {
        const error = new Error(
          "Price must be a valid number with up to 2 decimal places"
        );
        error.name = "CustomError"; // ✅ Custom name
        throw error;
      }
      const [minPrice, maxPrice] = query.price.split("-");
      customFilter.price = {
        [Op.between]: [minPrice, maxPrice],
      };
    }

    if (query.travellers) {
      customFilter.totalSeats = {
        [Op.gte]: query.travellers,
      };
    }
    if (query.tripDate) {
      const tripDateStart = new Date(`${query.tripDate}T00:00:00+05:30`); // Start of day
      const tripDateEnd = new Date(`${query.tripDate}T23:59:59+05:30`); // End of day

      customFilter.departureTime = {
        [Op.gte]: tripDateStart,
        [Op.lte]: tripDateEnd,
      };
    }
    if (query.sort) {
      const params = query.sort.split(",");
      const sortFilters = params.map((param) => param.split("_"));
      sortFilter = sortFilters;
    }
    const flights = await flightRepository.getAllFlights(
      customFilter,
      sortFilter
    );
    return flights;
  } catch (error) {
    console.warn(error.message);
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name === "CustomError") {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot fetch data of all the flights",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function getFlight(id) {
  try {
    const flight = await flightRepository.get(id);
    return flight;
  } catch (error) {
    console.warn(error.message);
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name === "CustomError") {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot fetch data of the flight",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

async function updateSeats(data) {
  try {
    const {flightId, seats, dec} = data;
    
    const response = await flightRepository.updateRemainingSeats(flightId, seats, dec);
    return response;
  } catch (error) {
    console.warn(error.message);
    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      });
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    } else if (error.name === "CustomError") {
      throw new AppError(error.message, StatusCodes.BAD_REQUEST);
    }
    throw new AppError(
      "Cannot update seats of a flights",
      StatusCodes.INTERNAL_SERVER_ERROR
    );
  }
}

module.exports = {
  createFlight,
  getFlights,
  getFlight,
  updateSeats,
};
