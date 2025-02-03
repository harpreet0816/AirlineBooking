const { StatusCodes } = require("http-status-codes");
const { AirplaneService } = require("../services");
const { ErrorResponse, SuccessResponse } = require("../utils/commons");

/* *
 *POST : /airplanes
 * req.body: {modelNumber: airbus320, capacity: 200}
 */
async function createAirplane(req, res) {
  try {
    const airplane = await AirplaneService.createAirplane({
      modelNumber: req.body.modelNumber,
      capacity: req.body.capacity,
    });

    SuccessResponse.message = "Successfully create an airplane";
    SuccessResponse.data = airplane;
    return res.status(StatusCodes.CREATED).json(SuccessResponse);
  } catch (error) {
    ErrorResponse.error = error;
    return res.status(error.statusCode).json(ErrorResponse);
  }
}

module.exports = {
  createAirplane,
};
