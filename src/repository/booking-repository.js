const {Booking} = require('../models/index');
const {ValidationError, AppError} = require('../utils/errors/index');
const {StatusCodes} = require('http-status-codes');
class BookingRepository{
    create = async (data) => {
        try {
            const booking = await Booking.create(data);
            return booking;
        } catch (error) {
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
}

module.exports = BookingRepository;