const {StatusCodes} = require('http-status-codes');
const { BookingService } = require('../services/index');

const bookingService = new BookingService();

const createBooking = async (req, res) => {
    try {
        const response = await bookingService.createBooking(req.body);
        return res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully created a booking',
            status: true,
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json({
            data: {},
            status: false,
            message: error.message,
            err: error
        })
    }
}

module.exports = {
    createBooking
}