const express = require('express');
const { BookingController } = require('../../controllers/index');
const router = express.Router();

router.get('/hello', (req, res) => {
    res.status(200).json({
        data: {},
        message: "Hello User, I hope you're doing well",
        status: true,
        err: {}
    });
})

router.post('/bookings', BookingController.createBooking);
router.patch('/bookings/:id', BookingController.cancelBooking);

module.exports = router;