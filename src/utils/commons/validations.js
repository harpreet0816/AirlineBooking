const { body, query, param } = require("express-validator");

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
      body("name")
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage("name must be a valid string"),
    ];
  }

  // 🚀 Airport Validations
  static validateCreateAirport() {
    return [
      body("name")
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage("name must be a valid string"),

      body("code")
        .isString()
        .trim()
        .isLength({ min: 3, max: 3 })
        .withMessage("code must be a valid 3-character string"),

      body("address")
        .optional() // ✅ Making address optional
        .isString()
        .trim()
        .withMessage("address must be a valid string"),

      body("cityId")
        .isNumeric()
        .withMessage("cityId must be a valid numeric value"),
    ];
  }

  // 🚀 Flight Validations
  static validateCreateFlight() {
    return [
      body("flightNumber")
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage("flightNumber must be a valid string"),

      body("airplaneId")
        .isNumeric()
        .withMessage("airplaneId must be a valid numeric value"),

      body("departureAirportId")
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage("departureAirportId must be a valid string"),

      body("arrivalAirportId")
        .isString()
        .trim()
        .isLength({ min: 3 })
        .withMessage("arrivalAirportId must be a valid string"),

      body("arrivalTime")
        .isISO8601() // ✅ Checks valid date-time format (YYYY-MM-DD or ISO)
        .toDate() // ✅ Converts to JavaScript Date object
        .withMessage("arrivalTime must be a valid date"),

      body("departureTime")
        .isISO8601() // ✅ Checks valid date-time format (YYYY-MM-DD or ISO)
        .toDate() // ✅ Converts to JavaScript Date object
        .withMessage("departureTime must be a valid date"),

      body("price")
        .isNumeric()
        .withMessage("airplaneId must be a valid numeric value"),

      body("boardingGate")
        .optional()
        .isString()
        .trim()
        .withMessage("boardingGate must be a valid string"),

      body("totalSeats")
        .isNumeric()
        .withMessage("totalSeats must be a valid numeric value"),
    ];
  }

  static validateSearchFlight() {
    return [
      query("trips")
        .matches(/^[A-Z]{3}-[A-Z]{3}$/)
        .withMessage("trips must be in format XXX-XXX (e.g., MUM-BLR)"),

      // query("price")
      //   .matches(/^\d{1,7}(\.\d{1,2})?$/)
      //   .withMessage(
      //     "Price must be a valid number with up to 2 decimal placesa"
      //   ),
    ];
  }

  static validateUpdateSeatsFlight() {
    return [
      param("id")
      .isNumeric()
      .withMessage("flightId must be a valid numeric value"),

      body("seats")
      .isInt({ min: 1 })
      .withMessage("seats must be a valid numeric value with min value 1"),

      body("dec")
      .isBoolean()
      .withMessage("Must be a boolean value")
      .optional(),
    ]
  }
}

module.exports = ValidationChecks;
