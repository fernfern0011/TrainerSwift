const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const amqp = require('amqplib')
const { sendMessageToQueue, connectToMQ } = require('../rabbitmq')


// Function to create a Stripe Connect Express account
const createStripeAccount = async () => {
    try {
      // Create a Stripe account
      const account = await stripe.accounts.create({
        type: 'express',
      });
  
      // Create an account link for onboarding
      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: 'http://localhost:3000', // Update with your localhost URL
        return_url: 'http://localhost:3000', // Update with your localhost URL
        type: 'account_onboarding',
      });
  
      console.log('Account Link URL:', accountLink.url);

      // Store `account.id` in your database associated with the user for future use
      // This allows you to know which Stripe account belongs to which user on your platform
      console.log(account.id)
      // Store `stripeAccountId` in your database, associated with the user who created it
  
      return {url: accountLink.url, id: account.id};
    } catch (error) {
      console.error('Error creating Stripe Connect Express account:', error);
      throw error; // Handle the error appropriately in your application
    }
  };
  
  // Example usage: Call this function when a trainer signs up or when they choose to connect their Stripe account
const stripeSignUp = async (req, res) => {
    try {
      const {url, id} = await createStripeAccount();
      res.status(200).json({url: url, id: id })
    } catch (error) {
      // Handle errors
      console.error('Error during trainer signup:', error);
    }
};

const webhook = async (req, res) => {
  const event = req.body;

  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      // console.log(paymentIntent)
      console.log('Payment Successful!')

      // Send push notification to RabbitMQ
      const channel = await connectToMQ();
      const paymentNotification = {
        type: 'payment_success',
        paymentIntent,
      };
      await sendMessageToQueue(channel, paymentNotification);

      // Then define and call a method to handle the successful payment intent.
      // handlePaymentIntentSucceeded(paymentIntent);
      break;
    case 'payment_method.attached':
      const paymentMethod = event.data.object;
      // Then define and call a method to handle the successful attachment of a PaymentMethod.
      // handlePaymentMethodAttached(paymentMethod);
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a response to acknowledge receipt of the event
  res.json({received: true});
};

module.exports = {
    stripeSignUp,
    webhook
}
