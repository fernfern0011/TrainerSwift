const amqp = require('amqplib');
require('dotenv').config();

const RABBITMQ_URL = 'amqp://default:default@rabbitmq:5672';
const QUEUE_NAME = 'payment_notifications';

let connection;
let channel;

async function connectToMQ() {
  if (!connection) {
    try {
      connection = await amqp.connect(RABBITMQ_URL);
      channel = await connection.createChannel();

      // Ensure the queue exists
      await channel.assertQueue(QUEUE_NAME, { durable: false });
    } catch (error) {
      console.error('Error connecting to RabbitMQ:', error);
      throw error;
    }
  }

  return channel;
}

// Send a message to RabbitMQ queue
async function sendMessageToQueue(channel, message) {
  try {
    await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
    console.log('Message sent to RabbitMQ:', message);
  } catch (error) {
    console.error('Error sending message to RabbitMQ:', error);
    throw error;
  }
}

module.exports = {
  connectToMQ,
  sendMessageToQueue
};
