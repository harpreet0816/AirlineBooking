const { validationResult } = require('express-validator');
const { StatusCodes } = require('http-status-codes');
const { ErrorResponse }  = require("../utils/commons");
const AppError = require('../utils/errors/app-error');
// Middleware to validate request
function AirplaneMiddleware  (req, res, next){

  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    // const errorMessages = errors.array().map(err => ({
    //   field: err.param,
    //   message: err.msg
    // }));
    const errorMessages = errors.array().map(err => (
     err.msg
    ));
    
    ErrorResponse.error = new AppError(errorMessages, StatusCodes.BAD_REQUEST) ;
    // Send error response with 400 status code and validation errors
    return res.status(StatusCodes.BAD_REQUEST).json(ErrorResponse);
  }

  // Proceed to the next middleware if no errors
  next();
};

module.exports = AirplaneMiddleware;
