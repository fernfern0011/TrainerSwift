const express = require('express');
const app = express();
const port = 5000;
const amqp = require('amqplib');

require('dotenv').config(); // Load environment variables
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const cors = require('cors')

app.use(cors({
  origin: 'http://localhost:3000',
  preflightContinue: false,
  credentials: true
}));

app.use(express.json());
app.use(bodyParser.json());

// const BASE_URL = process.env.BASE_URL || 'http://localhost:8000/stripeapi';

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/cart/get-all-cartitems', (req, res) => {
  const response = {
    data: [
      {
        "productid": 1,
        "accid": 1,
        "productname": "Blue Polo Shirt",
        "description": "Very Blue",
        "price": "20.00",
        "size": "M",
        "quantity": 1,
        "images": "images",
        "created_on": "2023-10-25T17:44:18.693Z",
        "category": null,
        "forwomen": null,
        "formen": null
      },
      {
        "productid": 2,
        "accid": 2,
        "productname": "Red Polo Shirt",
        "description": "Very Red",
        "price": "25.00",
        "size": "M",
        "quantity": 1,
        "images": "images",
        "created_on": "2023-10-25T17:44:18.693Z",
        "category": null,
        "forwomen": null,
        "formen": null
      },
      {
        "productid": 3,
        "accid": 3,
        "productname": "Green Polo Shirt",
        "description": "Very Green",
        "price": "105.00",
        "size": "M",
        "quantity": 1,
        "images": "images",
        "created_on": "2023-10-25T17:44:18.693Z",
        "category": null,
        "forwomen": null,
        "formen": null
      }
    ]
  };

  res.json(response);
});


app.use('/api/stripe', require('./src/routes/routes'))

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// // Function to create a Stripe Connect Express account
// const createStripeAccount = async () => {
//   try {
//     // Create a Stripe account
//     const account = await stripe.accounts.create({
//       type: 'express',
//     });

//     // Create an account link for onboarding
//     const accountLink = await stripe.accountLinks.create({
//       account: account.id,
//       refresh_url: 'http://localhost:3000', // Update with localhost URL
//       return_url: 'http://localhost:3000', // Update with localhost URL
//       type: 'account_onboarding',
//     });

//     console.log('Account Link URL:', accountLink.url);

//     return {url: accountLink.url, id: account.id};
//   } catch (error) {
//     console.error('Error creating Stripe Connect Express account:', error);
//     throw error; 
//   }
// };

// // Call this function when a trainer signs up or when they choose to connect their Stripe account
// app.post('/api/stripe/sign-up', async (req, res) => {
//     try {
//     const accountLinkUrl = await createStripeAccount();
//     // Redirect the trainer to `accountLinkUrl` to complete the onboarding process
//     // You can use this URL in a redirect or present it as a button/link to the trainer
//     console.log('Redirect the trainer to:', accountLinkUrl);
//   } catch (error) {
//     // Handle errors
//     console.error('Error during trainer signup:', error);
//   }
// });

// //RabbitMQ configuration
// const RABBITMQ_URL = 'amqp://default:default@rabbitmq:5672';
// const QUEUE_NAME = 'payment_notifications';

// // Connect to RabbitMQ and create a channel

// let connection
// let channel

// async function connectToMQ() {
//   if (!connection) {
//     try {
//       connection = await amqp.connect(RABBITMQ_URL);
//       channel = await connection.createChannel();

//       // Ensure the queue exists
//       await channel.assertQueue(QUEUE_NAME, { durable: false });
//     } catch (error) {
//       console.error('Error connecting to RabbitMQ:', error);
//       throw error;
//     }
//   }

//   return channel;
// }

// // Send a message to RabbitMQ queue
// async function sendMessageToQueue(channel, message) {
//   try {
//     await channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(message)));
//     console.log('Message sent to RabbitMQ:', message);
//   } catch (error) {
//     console.error('Error sending message to RabbitMQ:', error);
//     throw error;
//   }
// }

// app.post('/api/stripe/webhook', async (req, res) => {
//   const event = req.body;

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       // console.log(paymentIntent)
//       console.log('Payment Successful!')

//       // Send push notification to RabbitMQ
//       channel = await connectToMQ();
//       const paymentNotification = {
//         type: 'payment_success',
//         paymentIntent,
//       };
//       await sendMessageToQueue(channel, paymentNotification);

//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     // ... handle other event types
//     default:
//       console.log(`Unhandled event type ${event.type}`);
//   }

//   // Return a response to acknowledge receipt of the event
//   res.json({received: true});
// });




// const RABBITMQ_URL = 'amqp://default:default@localhost:5672';
// const QUEUE_NAME = 'payment_notifications';

// let channel; // Only one channel is needed, no need for separate connection variable

// async function connectToMQ() {
//   try {
//     const connection = await amqp.connect(RABBITMQ_URL);
//     channel = await connection.createChannel();
//     console.log('Connected to RabbitMQ');
//   } catch (error) {
//     console.error('Error connecting to RabbitMQ:', error);
//     process.exit(1);
//   }
// }

// function getChannel() {
//   if (!channel) {
//     console.error('RabbitMQ channel not initialized. Call connectToMQ first.');
//     process.exit(1);
//   }
//   return channel;
// }

// const trainerId = 'acct_1OnPQZFSwTDhdL4G';

// async function sendEmailNotification(eventData) {
//   const { paymentIntent } = eventData;
//   const mailOptions = {
//     from: 'trainerswift2024@gmail.com',
//     to: 'sathwikchiluveru@gmail.com',
//     subject: 'Payment Successful',
//     text: `Payment successful for trainer ID: ${trainerId}\n
//            Payment Details:\n
//            - Transaction ID: ${paymentIntent.id}\n
//            - Amount: ${paymentIntent.amount / 100} ${paymentIntent.currency}\n
//            - Status: ${paymentIntent.status}`,
//     html:
//     `
//     <html>
//       <head>
//       </head>
//       <body>
//         <div style="background-color: #f4f4f4; padding: 20px;">
//         <h1 style="color: #17B5B5;">Thank you for your purchase!</h1>
//         <p>Payment successful for trainer ID: ${trainerId}</p>
//         <p>Payment Details: </p>
//         <p>Transaction ID: ${paymentIntent.id}</p>
//         <p>Amount: ${paymentIntent.amount / 100} ${paymentIntent.currency}</p>
//         <p>Status: ${paymentIntent.status}</p>
//         </div>
//       </body>
//     </html>
//   `,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log('Email notification sent:');
//   } catch (error) {
//     console.error('Error sending email notification:', error);
//   }
// }

// async function subscribeToQueue() {
//   const channel = getChannel();

//   // Ensure the queue exists
//   await channel.assertQueue(QUEUE_NAME, { durable: false });

//   // Start consuming messages from the queue
//   channel.consume(QUEUE_NAME, (message) => {
//     if (message) {
//       const eventData = JSON.parse(message.content.toString());

//       // Check if the message is relevant for the specific Stripe account
//       if (eventData.paymentIntent.transfer_data.destination === trainerId) {
//         console.log('Received relevant message:', eventData);

//         // Send email
//         sendEmailNotification(eventData);

//         // Acknowledge the message
//         channel.ack(message);
//       }
//     }
//   });

//   console.log('Subscribed to RabbitMQ queue:', QUEUE_NAME);
// }

// async function startMicroservice() {
//   // Connect to RabbitMQ
//   await connectToMQ();

//   // Subscribe to RabbitMQ queue
//   await subscribeToQueue();
// }

// // Start the microservice
// startMicroservice();



