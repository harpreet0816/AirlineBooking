const express = require("express");
const { body } = require("express-validator");
const { ValidationChecks } = require("../../utils/commons");
const { BookingController } = require("../../controllers");

const router = express.Router();

router.post("/", BookingController.createBooking);

router.post("/payments", BookingController.makePayment);

module.exports = router;