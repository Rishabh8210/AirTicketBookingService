const express = require('express');
const { BookingController } = require('../../controllers/index');
const router = express.Router();
const { createChannel } = require('../../utils/messageQueue')

const bookingController = new BookingController()

router.post('/bookings', bookingController.createBooking);
router.post('/publish', bookingController.sendMessageToQueue);
router.patch('/bookings/:id', bookingController.cancelBooking);

router.get('/hello', (req, res) => { // localhost:3000/api/v1/hello
    return res.status(200).json({
        message: 'Hello User',
        status: true
    })
})

module.exports = router;