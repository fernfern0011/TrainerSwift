import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export async function GET() {
    const res = await fetch(`${DATA_SOURCE_URL}/availability`)
    const getAllAvailability = await res.json()

    return NextResponse.json(getAllAvailability)
}

export async function POST(req) {
    const { day, time, toRemoveTime, status, packageid } = await req.json()

    if (!day || time.length == 0 || !status || !packageid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    console.log(day, time, toRemoveTime, status, packageid);

    try {
        // const responses = await Promise.all(time.map(async (timeItem) => {
        //     const res = await fetch(`${DATA_SOURCE_URL}/availability/create`, {
        //         method: 'POST',
        //         headers: {
        //             "Content-Type": "application/json",
        //             'API-Key': process.env.DATA_API_KEY
        //         },
        //         body: JSON.stringify({
        //             day: day,
        //             time: timeItem,
        //             status: status,
        //             packageid: packageid
        //         })
        //     });

        //     const result = await res.json()
        //     return result
        // }));

        return NextResponse.json('responses')
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ "code": 500, "message": error })
    }
}

export async function DELETE(req) {
    const { availabilityid } = await req.json()

    if (!availabilityid) return NextResponse.json({ "message": "Availability id is required!" })

    await fetch(`${DATA_SOURCE_URL}/${availabilityid}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
            'API-Key': process.env.DATA_API_KEY
        }
    })

    return NextResponse.json({ "message": `Availability ${availabilityid} deleted successfully.` })
}