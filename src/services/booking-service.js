const axios = require('axios')
const {FLIGHT_SERVICE_PATH} = require('../config/serverConfig')
const { BookingRepository } = require('../repository/index');
const { ServiceError } = require('../utils/errors');

class BookingService {
    constructor(){
        this.bookingRepository = new BookingRepository();     
    }

    #getRefundableAmount(bookedTime, flightDepartureTime, price) {
        // 2024-08-26T13:30:00.000Z
        const bookedDate = new Date(bookedTime);
        const flightDepartureDate = new Date(flightDepartureTime);

        const differenceInMilliSeconds = bookedDate - flightDepartureDate;
        const differenceInHours = differenceInMilliSeconds / (1000 * 60 * 60);

        let refundableAmount = price;
        let isCancellable = false; 
        // If user cancelled the ticket before 4 days, then refund 50% of price
        if(differenceInHours >= 4*24){
            refundableAmount = price - ((50/100)*price);
            isCancellable = true;
        } 
        // If user cancelled the ticket between 0-3 days before, then refund 25% of price
        else if(differenceInHours >= 2 && differenceInHours < 4*24){
            refundableAmount = price - ((75/price)*100);
            isCancellable = true;
        } else{
            return null
        }
        return {
            refundableAmount,
            isCancellable
        }
    }

    async createBooking (data){
        try {
            const flightId = data.flightId;
            const getFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${flightId}`;
            const response = await axios.get(getFlightRequestUrl);
            // console.log(response)
            const flightData = response.data.data;

            let priceOfTheFlight = flightData.price;
            if(data.noOfSeats > flightData.totalSeats){
                throw new ServiceError (
                    'ServiceError',
                    'Something went wrong in the booking process',
                    'Insufficient seats in the flight',
                )
            }
            const totalCost = priceOfTheFlight * data.noOfSeats;
            const bookingPayload = {...data, totalCost};
            const booking = await this.bookingRepository.create(bookingPayload);
            console.log(booking)
            const updateFlightRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${booking.flightId}`
            await axios.patch(updateFlightRequestUrl, {totalSeats: flightData.totalSeats - booking.noOfSeats})
            const finalBooking = await this.bookingRepository.update(booking.id, {status: "Booked"});
            return finalBooking;
        } catch (error) {
            console.log(error)
            if(error.name == 'RepositoryError' || error.name == 'ValidationError') {
                throw error
            }
            throw new ServiceError();
        }
    }
    async cancelFlight(bookingId){
        try {
            const bookingDetails = await this.bookingRepository.get(bookingId);
            const bookedTime = bookingDetails.createdAt;
            
            const flightDetailsRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${bookingDetails.flightId}`;
            const flightDetailsResponse = await axios.get(flightDetailsRequestUrl);
            const flightDetails = flightDetailsResponse.data.data;

            const isCancellable = this.#getRefundableAmount(bookedTime, flightDetails.departureTime, flightDetails.price);
            console.log(isCancellable)
            if(isCancellable){
                const cancelBooking = await this.bookingRepository.update(bookingId, {status: "Cancelled"});
                const updateFlightDetailsRequestUrl = `${FLIGHT_SERVICE_PATH}/api/v1/flights/${bookingDetails.flightId}`;
                const finalResponse = await axios.patch(updateFlightDetailsRequestUrl, {totalSeats: flightDetails.totalSeats + bookingDetails.noOfSeats});
                return {...cancelBooking.dataValues, refundableAmount: isCancellable.refundableAmount};
            } else{
                throw new ServiceError(
                    'ServiceError',
                    'An issue occurred during the cancellation process',
                    "The flight cannot be cancelled at this stage. Please check the flight status or contact support for further assistance."
                );
            }
        } catch (error) {
            console.log(error)
            if(error.name == 'RepositoryError' || error.name == 'ValidationError' || error.name == 'ServiceError') {
                throw error
            }
            throw new ServiceError();
        }
    }
}

module.exports = BookingService