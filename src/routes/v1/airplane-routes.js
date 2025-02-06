const express = require("express");
const { body } = require("express-validator");
const { ValidationChecks } = require("../../utils/commons");
const {AirplaneController} = require("../../controllers");
const { AirplaneMiddleware } = require("../../middlewares");

const router = express.Router();
router.post("/",ValidationChecks.validateCreateAirplane(),
  AirplaneMiddleware, AirplaneController.createAirplane);

router.get("/", AirplaneController.getAirplanes);

router.get("/:id", AirplaneController.getAirplane);

router.delete("/:id", AirplaneController.destroyAirplane);

router.patch("/:id", AirplaneController.updateAirplane);

module.exports = router;