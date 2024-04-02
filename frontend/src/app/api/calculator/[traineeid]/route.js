import jwt from 'jsonwebtoken'
import { headers } from 'next/headers'
import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/calculatorapi/calculator/'

export const dynamic = 'force-dynamic';

export async function GET(req, context) {
    const { traineeid } = await context.params
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
            const res = await fetch(`${DATA_SOURCE_URL}/${traineeid}`)
            const getCalcResult = await res.json()

            return NextResponse.json(getCalcResult)
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}