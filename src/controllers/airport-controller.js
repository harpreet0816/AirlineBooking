const { StatusCodes } = require("http-status-codes");
const { AirportService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/commons");

/* *
 *POST : /airports
 * req.body: {modelNumber: airbus320, capacity: 200}
 */
async function createAirport(req, res) {
  try {
    const airport = await AirportService.createAirport({
      name: req.body.name,
      code: req.body.code,
      address: req.body?.address,
      cityId: req.body.cityId,
    });

    SuccessResponse.message = "Successfully create an airport";
    SuccessResponse.data = airport;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAirports(req, res) {
  try {
    const airport = await AirportService.getAirports();

    SuccessResponse.message = "Successfully get all Airports";
    SuccessResponse.data = airport;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function getAirport(req, res) {
  try {
    const id = req.params.id;
    const airport = await AirportService.getAirport(id);

    SuccessResponse.message = "Successfully get Airport";
    SuccessResponse.data = airport;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function destroyAirport(req, res) {
  try {
    const id = req.params.id;
    const airport = await AirportService.destroyAirport(id);

    SuccessResponse.message = "Successfully deleted Airport";
    SuccessResponse.data = airport;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

async function updateAirport(req, res) {
  try {
    const id = req.params.id;
    const data = req.body;
    const airport = await AirportService.updateAirport(id,data);

    SuccessResponse.message = "Successfully updated Airport";
    SuccessResponse.data = airport;
    return res.status(StatusCodes.OK).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createAirport,
  getAirports,
  getAirport,
  destroyAirport,
  updateAirport,
};
