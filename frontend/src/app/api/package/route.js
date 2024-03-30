import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export const dynamic = 'force-dynamic'

export async function GET() {
    const res = await fetch(`${DATA_SOURCE_URL}/package`)
    const getAllPackage = await res.json()

    return NextResponse.json(getAllPackage)
}

export async function POST(req) {
    const { name, detail, price, mode, address, postid, ispremium } = await req.json()

    if (!name || !detail || !price || !mode || !postid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    const res = await fetch(`${DATA_SOURCE_URL}/package/create`, {
        method: 'POST',
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

export async function DELETE(req) {
    const { packageid } = await req.json()

    if (!packageid) return NextResponse.json({ "message": "Package id is required!" })

    await fetch(`${DATA_SOURCE_URL}/package/${packageid}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            'API-Key': process.env.DATA_API_KEY
        }
    })

    return NextResponse.json({ "message": `Package ${packageid} deleted successfully.` })

}