const {Booking} = require('../models/index');
const {ValidationError, AppError} = require('../utils/errors/index');
const {StatusCodes} = require('http-status-codes');
class BookingRepository{
    create = async (data) => {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
            console.log("Repository", error)
            if(error.name == 'SequelizeValidationError'){
                throw new ValidationError(error);
            }
            throw new AppError(
                'RepositoryError',
                "Can't create Booking",
                "There was some issue creating in the booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }

    update = async (bookingId, data) => {
        try {
            const response = await Booking.update(data, {
                where: {
                    id: bookingId
                }
            })
            const updatedFlight = await Booking.findByPk(bookingId);
            return updatedFlight;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                "Can't create Booking",
                "There was some issue updating in the booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }

    get = async(bookingId) => {
        try {
            console.log(bookingId)
            const response = await Booking.findByPk(bookingId);
            return response;
        } catch (error) {
            throw new AppError(
                'RepositoryError',
                "Can't fetch Booking details",
                "There was some issue fetching in the booking, please try again later",
                StatusCodes.INTERNAL_SERVER_ERROR
            )
        }
    }
}

module.exports = BookingRepository;