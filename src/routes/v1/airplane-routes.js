const express = require("express");
const { body } = require("express-validator");
const {AirplaneController} = require("../../controllers");
const { AirplaneMiddleware } = require("../../middlewares");

const router = express.Router();
router.post("/",[
    // Validate modelNumber as a string and ensure it's at least 3 characters long
    body('modelNumber')
      .isString()
      .isLength({ min: 3 })
      .withMessage('modelNumber must be a valid string of at least 3 characters'),
    
    // Validate capacity (optional), ensure it's numeric and greater than 0 if present
    body('capacity')
      .optional() // Capacity is optional
      .isNumeric()
      .custom(value => value > 0)
      .withMessage('capacity must be a valid numeric value greater than 0')
  ],
  AirplaneMiddleware, AirplaneController.createAirplane);

router.get("/", AirplaneController.getAirplanes);

router.get("/:id", AirplaneController.getAirplane);

router.delete("/:id", AirplaneController.destroyAirplane);

router.patch("/:id", AirplaneController.updateAirplane);

module.exports = router;