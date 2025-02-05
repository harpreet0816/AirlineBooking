const express = require("express");
const { body } = require("express-validator");
const { CityController } = require("../../controllers");
const { CityMiddleware } = require("../../middlewares");

const router = express.Router();

router.post("/", [
    body("name").isString().trim().isLength({min:3}).withMessage('name must be a valid string')
], CityMiddleware, CityController.createCity)

router.get("/", CityController.getCities);

router.get("/:id", CityController.getCity);

router.delete("/:id", CityController.destroyCity);

router.patch("/:id", CityController.updateCity);

module.exports = router;