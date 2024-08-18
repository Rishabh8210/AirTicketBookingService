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

const cancelBooking = async (req, res) => {
    try {
        console.log(req.params.id)
        const response = await bookingService.cancelFlight(req.params.id);
        return res.status(StatusCodes.OK).json({
            data: response, 
            status: true,
            message: 'Your ticket is successfully cancelled',
            err: {}
        })
    } catch (error) {
        console.log(error);
        return res.status(error.statusCode).json({
            data: {},
            status: false,
            message: 'Not able to cancel the ticket',
            err: error
        })
    }
}

module.exports = {
    createBooking,
    cancelBooking
}