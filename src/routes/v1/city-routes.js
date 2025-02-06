const express = require("express");
const { body } = require("express-validator");
const { ValidationChecks } = require("../../utils/commons");
const { CityController } = require("../../controllers");
const { CityMiddleware } = require("../../middlewares");

const router = express.Router();

router.post("/", ValidationChecks.validateCreateCity(), CityMiddleware, CityController.createCity)

router.get("/", CityController.getCities);

router.get("/:id", CityController.getCity);

router.delete("/:id", CityController.destroyCity);

router.patch("/:id", CityController.updateCity);

module.exports = router;