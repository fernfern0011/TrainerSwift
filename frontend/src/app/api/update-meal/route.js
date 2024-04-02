import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const DATA_SOURCE_URL = 'http://localhost:8000/checkingdietapi/check_my_diet'

export const dynamic = 'force-dynamic';

export async function PUT(req) {
    const { traineeid, foodname, quantity, mealid } = await req.json()

    const postData = {
        mealid: mealid,
        traineeid: traineeid,
        meal: {
            foodname: foodname,
            quantity: quantity
        },
        method_used: "PUT"
    };

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
    };
    
    try {
        const headersInstance = headers()
        const authHeader = headersInstance.get('Authorization')

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else {
            const response = await fetch(DATA_SOURCE_URL, requestOptions); // Send POST request to the correct endpoint
            const data = await response.json();
            return NextResponse.json(data);
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}
