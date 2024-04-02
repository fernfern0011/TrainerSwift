import { NextResponse } from 'next/server';

const DATA_SOURCE_URL = 'http://localhost:8000/trainerapi';

export const dynamic = 'force-dynamic';

export async function POST(req) {
    const { username, email, password, name } = await req.json();

    if (!username || !email || !password || !name) {
        return NextResponse.json({ "code": 400, "message": "Missing required data" });
    }

    return new Promise(async (resolve, reject) => {
        try {
            // Make a request to Stripe to create a new account
            const stripeResponse = await fetch('http://localhost:3000/api/stripe-signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, email })
            });

            // Check if the request to Stripe was successful
            if (!stripeResponse.ok) {
                throw new Error('Failed to register with Stripe');
            }

            const stripeData = await stripeResponse.json();
            const stripeDataJson = {
                url: stripeData.url,
                id: stripeData.id
            };

            console.log(stripeDataJson.id);
            console.log(stripeDataJson.url)
            
            // Now that we have the Stripe ID, proceed with creating the trainer account
            const res = await fetch(`${DATA_SOURCE_URL}/trainer/create`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'API-Key': process.env.DATA_API_KEY
                },
                body: JSON.stringify({
                    username: username,
                    email: email,
                    password: password,
                    name: name,
                    stripeid: stripeDataJson.id // Include the Stripe ID in the trainer account creation request
                })
            });

            const result = await res.json();
            console.log(result)
            resolve(NextResponse.json({result: result, url : stripeDataJson.url}));
        } catch (error) {
            console.error('Error during registration:', error);
            reject(NextResponse.error(new Error('Failed to register'), { status: 500 }));
        }
    });
}
