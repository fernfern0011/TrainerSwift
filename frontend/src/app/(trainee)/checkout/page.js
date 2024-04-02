"use client"
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import Cookies from 'js-cookie';
import { Stack, Button, IconButton, Card, CardHeader, CardBody, Heading, StackDivider, Box, Text } from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
const stripe = require('stripe')('sk_test_51O2p9QFD3c4VDISeYPMwEIN9FUSwgdfeqZpcGhhQ6l7af7xrQAXIJ6mb3bbcRNfJFA2zuOojGGtLukbwuEdmgyqt00MRd5fHHK');
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
);



// const trainer_id = 'acct_1OnPQZFSwTDhdL4G';

export default function Checkout() {
  const [productData, setProductData] = useState([]);
  const [newSession, setNewSession] = useState(null);
  const [checkToken, setCheckToken] = useState('');
  const [stripeid, setStripeid] = useState('')
  const router = useRouter();
  const searchParams = useSearchParams()

  const [formData, setFormData] = useState({
    trainerid: searchParams.get('trainerid'),
    trainername: searchParams.get('trainername'),
    package: searchParams.get('package'),
    day: searchParams.get('day'),
    time: searchParams.get('time'),
    address: searchParams.get('address'),
    price: searchParams.get('price'),
    traineeid: 0,
    traineename: ""
  })

  console.log(formData);

  useEffect(() => {
    const token = Cookies.get('token')
    const traineeinfo = Cookies.get('traineeinfo')
    var traineeid

    if (!token) {
      router.replace('/') // If no token is found, redirect to login page
      return
    }

    if (!(traineeinfo === undefined)) {
      traineeid = JSON.parse(traineeinfo)
    }

    setCheckToken(token)
    setFormData({
      ...formData,
      traineeid: traineeid.traineeid,
      traineename: traineeid.name
    })

    setStripeid(traineeid.stripeid)

    const query = new URLSearchParams(window.location.search);

    if (query.get('success')) {
      console.log('Order placed! You will receive an email confirmation.');
    }

    if (query.get('canceled')) {
      console.log('Order canceled -- continue to shop around and checkout when you’re ready.');
    }
  }, []);


  const createCheckoutSession = async () => {
    try {

      const response = await fetch(`http://localhost:3000/api/cart/${formData.traineeid}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${checkToken}`,
        }
      });

      if (!response.ok) {
        throw new Error('Error fetching product information');
      }

      const stripes = await stripePromise;
      console.log(stripes);
      const responseData = await response.json();
      const cartItem = responseData.data;
      console.log(cartItem)

      const productName = cartItem.packagename;
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

      const lineItems = [{
        price: price.id,
        quantity: 1,
      }];

      const totalAmount = priceInCents;
      const applicationFeeAmount = Math.round(totalAmount * 0.0002);

      const session = await stripe.checkout.sessions.create({
        line_items: lineItems,
        payment_intent_data: {
          application_fee_amount: applicationFeeAmount,
          transfer_data: {
            destination: stripeid,
          },
        },
        mode: 'payment',
        success_url: `${window.location.origin}/?success=true`,
        cancel_url: `${window.location.origin}/?canceled=true`,
        automatic_tax: { enabled: true },
      });

      setProductData([{ product, price }]);
      setNewSession(session);

      // Redirect to the Stripe Checkout page
      window.location.href = session.url;
    } catch (err) {
      console.error(err);
    }
  };


  return (
    <Box p={20}>
      <Stack direction='row' align={'center'}>
        <IconButton
          isRound={true}
          variant='solid'
          colorScheme='teal'
          aria-label='Done'
          fontSize='36px'
          mr={'10px'}
          icon={<ChevronLeftIcon />}
          onClick={() => router.push(`/view-trainer/${formData.trainerid}`)}
        />
      </Stack>
      <Stack minH={'57.7vh'} w={'lg'} justifyContent={'center'} m={'auto'}>
        <Card>
          <CardHeader>
            <Heading size='lg' >Summary</Heading>
          </CardHeader>
          <CardBody mt={'-25px'}>
            <Stack divider={<StackDivider />} spacing='4'>
              <Box>
                <div>
                  <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                    Trainer:
                  </Heading>
                  <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                    {formData.trainername}
                  </Text>
                </div>
                <div>
                  <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                    Trainee:
                  </Heading>
                  <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                    {formData.traineename}
                  </Text>
                </div>
              </Box>
              <Box>
                <div>
                  <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                    Package:
                  </Heading>
                  <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                    {formData.package}
                  </Text>
                </div>
                <div>
                  <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                    Day:
                  </Heading>
                  <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                    {formData.day}
                  </Text>
                </div>
                <div>
                  <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                    Time:
                  </Heading>
                  <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                    {formData.time}
                  </Text>
                </div>
                <div>
                  <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                    Location:
                  </Heading>
                  <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                    {formData.address}
                  </Text>
                </div>
              </Box>
              <Box>
                <div>
                  <Heading size='xs' textTransform='uppercase' style={{ display: 'inline-block' }}>
                    Total Cost:
                  </Heading>
                  <Text pt='2' fontSize='sm' ml={"5px"} style={{ display: 'inline-block' }}>
                    ${formData.price}
                  </Text>
                </div>
              </Box>
            </Stack>
          </CardBody>
        </Card>
        <Button type="button" colorScheme='red'
          variant={'solid'} onClick={createCheckoutSession}>
          Checkout
        </Button>
      </Stack>
    </Box>
  );
}
