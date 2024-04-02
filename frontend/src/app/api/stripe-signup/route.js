import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const res = await fetch(`http://localhost:8000/stripeapi/api/stripe/stripe-signup`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'API-Key': process.env.DATA_API_KEY
            }
        });

        if (!res.ok) {
            // Handle error response from the Stripe signup endpoint
            const errorData = await res.json();
            return NextResponse.json({ "code": res.status, "message": errorData.message });
        }

        // If signup successful, return the data
        const result = await res.json();
        return NextResponse.json(result);
    } catch (error) {
        console.error("Error occurred during Stripe signup:", error);
        return NextResponse.json({ "code": 500, "message": "Internal server error" });
    }
}
