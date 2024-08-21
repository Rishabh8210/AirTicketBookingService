const dotenv = require('dotenv')
dotenv.config();

module.exports = {
    PORT: process.env.PORT,
    DB_SYNC: process.env.DB_SYNC,
    FLIGHT_SERVICE_PATH: process.env.FLIGHT_SERVICE_PATH,
    AUTH_SERVICE_PATH: process.env.AUTH_SERVICE_PATH,
    EXCHANGE_NAME: process.env.EXCHANGE_NAME,
    MESSAGE_BROKER_URL: process.env.MESSAGE_BROKER_URL,
    REMAINDER_BINDING_KEY: process.env.REMAINDER_BINDING_KEY
}