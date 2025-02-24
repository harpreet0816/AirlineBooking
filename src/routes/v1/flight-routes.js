const express = require("express");
const { body } = require("express-validator");
const { ValidationChecks } = require("../../utils/commons");
const {FlightController} = require("../../controllers");
const { FlightMiddleware } = require("../../middlewares");

const router = express.Router();
router.post("/",ValidationChecks.validateCreateFlight(),
  FlightMiddleware, FlightController.createFlight);

router.get("/",ValidationChecks.validateSearchFlight(), FlightMiddleware, FlightController.getFlights);

router.get("/:id", FlightController.getFlight);

router.patch("/:id/seats", ValidationChecks.validateUpdateSeatsFlight(), FlightMiddleware,  FlightController.updateSeats);


module.exports = router