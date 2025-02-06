
const express = require("express");
const { body } = require("express-validator");
const { ValidationChecks } = require("../../utils/commons");
const {AirportController} = require("../../controllers");
const { AirportMiddleware } = require("../../middlewares");

const router = express.Router();
router.post("/",ValidationChecks.validateCreateAirport(),
  AirportMiddleware, AirportController.createAirport);

router.get("/", AirportController.getAirports);

router.get("/:id", AirportController.getAirport);

router.delete("/:id", AirportController.destroyAirport);

router.patch("/:id", AirportController.updateAirport);

module.exports = router;