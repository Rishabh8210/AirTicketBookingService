const amqplib = require('amqplib');
const {EXCHANGE_NAME, MESSAGE_BROKER_URL} = require('../config/serverConfig')
async function createChannel(){
    try {
        const connection = await amqplib.connect(MESSAGE_BROKER_URL);
        const channel = await connection.createChannel()
        await channel.assertExchange(EXCHANGE_NAME, 'direct', false)
        return channel;
    } catch (error) {
        console.log('Something went wrong inside message queue', error)
        throw error
    }
}

const subscribeMessage = async (channel, service, binding_key) => {
    try {
        const applicationQueue = await channel.assertQueue('QUEUE_NAME');
        channel.bindQueue(applicationQueue.queue, EXCHANGE_NAME, binding_key);
        channel.consume(applicationQueue.queue, (msg) => {
            console.log('received data');
            console.log(msg.content.toString());
            channel.ack(msg);
        })
    } catch (error) {
        console.log('Something went wrong inside message queue')
        throw error
    }
}

const publishMessage = async (channel, binding_key, message) => {
    try {
        await channel.assertQueue('QUEUE_NAME')
        await channel.publish(EXCHANGE_NAME, binding_key, Buffer.from(message))
    } catch (error) {
        console.log('Something went wrong inside message queue')
        throw error
    }
}

module.exports = {
    createChannel,
    subscribeMessage,
    publishMessage
}