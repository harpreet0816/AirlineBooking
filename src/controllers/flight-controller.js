const { StatusCodes } = require("http-status-codes");
const { FlightService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/commons");

/* *
 *POST : /flights
 * req.body: {modelNumber: airbus320, capacity: 200}
 */
async function createFlight(req, res) {
  try {
    const flight = await FlightService.createFlight({
      flightNumber: req.body.flightNumber,
      airplaneId: req.body.airplaneId,
      departureAirportId: req.body.departureAirportId,
      arrivalAirportId: req.body.arrivalAirportId,
      arrivalTime: req.body.arrivalTime,
      departureTime: req.body.departureTime,
      price: req.body.price,
      boardingGate: req.body?.boardingGate,
      totalSeats: req.body.totalSeats,
    });

    SuccessResponse.message = "Successfully create an flight";
    SuccessResponse.data = flight;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}


async function getFlights(req, res) {
    try {
      const query = req.query;
      const flights = await FlightService.getFlights(query);
  
      SuccessResponse.message = "Successfully get all Flights";
      SuccessResponse.data = flights;
      return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
      ErrorResponse.error = error;
      return res.status(error.statusCode).json(ErrorResponse);
    }
  }


async function getFlight(req, res) {
    try {
      const {id} = req.params;
      const flight = await FlightService.getFlight(id);
  
      SuccessResponse.message = "Successfully get Flight";
      SuccessResponse.data = flight;
      return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
      ErrorResponse.error = error;
      return res.status(error.statusCode).json(ErrorResponse);
    }
  }

async function updateSeats(req, res) {
    try {
      const {id : flightId} = req.params;
      const {seats, dec} = req.body;

      const flight = await FlightService.updateSeats({flightId, seats, dec});

      SuccessResponse.message = "Successfully updated flight seats";
      SuccessResponse.data = flight;
      return res.status(StatusCodes.OK).json(SuccessResponse);
    } catch (error) {
      ErrorResponse.error = error;
      return res.status(error.statusCode).json(ErrorResponse);
    }
  }

module.exports = {
    createFlight,
    getFlights,
    getFlight,
    updateSeats,
}