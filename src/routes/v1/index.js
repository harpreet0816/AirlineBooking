const express = require('express');

const { InfoController } = require('../../controllers');
const bookingRoutes = require("./booking-router");
const router = express.Router();


router.use("/booking", bookingRoutes);

router.get('/info', InfoController.info);

module.exports = router;