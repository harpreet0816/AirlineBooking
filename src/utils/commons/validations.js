const { body } = require("express-validator");

class ValidationChecks {
  // 🚀 Airplane Validations
  static validateCreateAirplane() {
    return [
      // Validate modelNumber as a string and ensure it's at least 3 characters long
      body("modelNumber")
        .isString()
        .isLength({ min: 3 })
        .withMessage(
          "modelNumber must be a valid string of at least 3 characters"
        ),

      // Validate capacity (optional), ensure it's numeric and greater than 0 if present
      body("capacity")
        .optional() // Capacity is optional
        .isNumeric()
        .custom((value) => value > 0)
        .withMessage("capacity must be a valid numeric value greater than 0"),
    ];
  }

  // 🚀 City Validations
  static validateCreateCity() {
    return [
        body("name").isString().trim().isLength({min:3}).withMessage('name must be a valid string')
    ];
  }

  // 🚀 Airport Validations
  static validateCreateAirport() {
    return [
        body("name")
            .isString().trim().isLength({ min: 3 })
            .withMessage('name must be a valid string'),

        body("code")
            .isString().trim().isLength({ min: 3, max: 3 }) 
            .withMessage('code must be a valid 3-character string'),

        body("address")
            .optional() // ✅ Making address optional
            .isString().trim()
            .withMessage('address must be a valid string'),

        body("cityId")
            .isNumeric() 
            .withMessage('cityId must be a valid numeric value'),
    ];
  }
}

module.exports = ValidationChecks;
