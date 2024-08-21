const express = require('express');
const { BookingController } = require('../../controllers/index');
const router = express.Router();
const { createChannel } = require('../../utils/messageQueue')

const bookingController = new BookingController()

router.post('/bookings', bookingController.createBooking);
router.post('/publish', bookingController.sendMessageToQueue);
router.patch('/bookings/:id', bookingController.cancelBooking);

module.exports = router;