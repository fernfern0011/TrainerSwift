import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export const dynamic = 'force-dynamic'

export async function GET(req, context) {
    const { packageid } = await context.params

    if (!packageid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

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
            const [packageRes, availabilityRes] = await Promise.all([
                fetch(`${DATA_SOURCE_URL}/package/${packageid}`),
                fetch(`${DATA_SOURCE_URL}/package/${packageid}/availability`)
            ])

            const [getPackageInfo, getAvailabilityInfo] = await Promise.all([
                packageRes.json(),
                availabilityRes.json()
            ])

            return NextResponse.json({ packageInfo: getPackageInfo, availabilityInfo: getAvailabilityInfo })
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}

export async function PUT(req) {
    const { packageid, name, detail, price, mode, address, postid, ispremium } = await req.json()

    if (!packageid || !name || !detail || !price || !mode || !postid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

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
            const res = await fetch(`${DATA_SOURCE_URL}/package/${packageid}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    'API-Key': process.env.DATA_API_KEY
                },
                body: JSON.stringify({
                    name: name,
                    detail: detail,
                    price: price,
                    mode: mode,
                    address: address,
                    postid: postid,
                    ispremium: ispremium
                })
            })

            const result = await res.json()
            return NextResponse.json(result)
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}