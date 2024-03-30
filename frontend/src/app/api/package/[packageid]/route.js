import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export async function GET(req, context) {
    const { packageid } = await context.params

    if (!packageid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

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

export async function PUT(req) {
    const { packageid, name, detail, price, mode, address, postid, ispremium } = await req.json()

    if (!packageid || !name || !detail || !price || !mode || !postid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

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