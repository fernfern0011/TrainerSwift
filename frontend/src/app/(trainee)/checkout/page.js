"use client"
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
const stripe = require('stripe')('sk_test_51O2p9QFD3c4VDISeYPMwEIN9FUSwgdfeqZpcGhhQ6l7af7xrQAXIJ6mb3bbcRNfJFA2zuOojGGtLukbwuEdmgyqt00MRd5fHHK');
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);

const trainer_id = 'acct_1OnPQZFSwTDhdL4G';

export default function Checkout() {
  const [productData, setProductData] = useState([]);
  const [newSession, setNewSession] = useState(null);

  const createCheckoutSession = async () => {
    try {

      // const jsonData = {
      //   "traineeID": "1",
      //   "trainerID": "2",
      //   "packageID": "3",
      //   "availabilityID": 9
      // }

      // const microserviceResponse = await fetch('http://localhost:8000/bookingaslotapi/payment', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(jsonData)
      // });

      // if (!microserviceResponse.ok) {
      //   throw new Error('Error triggering microservice');
      // }

      const response = await fetch('http://localhost:5000/api/cart/get-all-cartitems');

      if (!response.ok) {
        throw new Error('Error fetching product information');
      }

      const stripes = await stripePromise;
      console.log(stripes);      
      const responseData = await response.json();
      const cartItems = responseData.data;
      console.log(cartItems)

      const products = [];

      for (const cartItem of cartItems) {
        const productName = cartItem.packagename + " with " + cartItem.trainername;
        const productPrice = parseFloat(cartItem.price);

        const product = await stripe.products.create({
          name: productName,
        });

        const priceInCents = Math.round(productPrice * 100);

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: priceInCents,
          currency: 'sgd',
        });

        products.push({ product, price });
      }

      const lineItems = products.map((item) => ({
        price: item.price.id,
        quantity: 1,
      }));

      const totalAmount = productData.reduce((total, item) => total + item.price.unit_amount, 0);
      console.log(totalAmount)
      const applicationFeeAmount = Math.round(totalAmount * 0.0002 * 100);
      console.log(applicationFeeAmount)

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        payment_intent_data: {
          application_fee_amount: applicationFeeAmount,
          transfer_data: {
            destination: trainer_id,
          },
        },
        mode: 'payment',
        success_url: `${window.location.origin}/?success=true`,
        cancel_url: `${window.location.origin}/?canceled=true`,
        automatic_tax: { enabled: true },
      });

      setProductData(products);
      setNewSession(session);

      // Redirect to the Stripe Checkout page
      window.location.href = session.url;
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);

  return (
    <form>
      <section>
        <button type="button" onClick={createCheckoutSession}>
          Checkout
        </button>
      </section>
      <style jsx>
        {`
          section {
            background: #ffffff;
            display: flex;
            flex-direction: column;
            width: 400px;
            height: 112px;
            border-radius: 6px;
            justify-content: space-between;
          }
          button {
            height: 36px;
            background: #556cd6;
            border-radius: 4px;
            color: white;
            border: 0;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
          }
          button:hover {
            opacity: 0.8;
          }
        `}
      </style>
    </form>
  );
}
