const { validationResult } = require("express-validator");
const { StatusCodes } = require("http-status-codes");
const { ErrorResponse } = require("../utils/commons");
const AppError = require("../utils/errors/app-error");

const CityMiddleware = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map((err) => err.msg);

    ErrorResponse.error = new AppError(errorMessages, StatusCodes.BAD_REQUEST);
    // Send error response with 400 status code and validation errors
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }
  next();
};

module.exports = CityMiddleware;
