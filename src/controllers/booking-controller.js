const {StatusCodes} = require('http-status-codes');
const { BookingService } = require('../services/index');

const { createChannel, publishMessage } = require('../utils/messageQueue');
const { REMAINDER_BINDING_KEY } = require('../config/serverConfig');

const bookingService = new BookingService();

class BookingController {
    constructor(channel){
        // this.channel = channel
    }
    sendMessageToQueue = async(req, res) => {
        const channel = await createChannel()
        const data = {message: 'Success'}
        publishMessage(channel, REMAINDER_BINDING_KEY, JSON.stringify(data));
        return res.status(StatusCodes.OK).json({
            message: 'Successfull published the event'
        })
    }
    createBooking = async (req, res) => {
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
    
    cancelBooking = async (req, res) => {
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
}


module.exports = BookingController