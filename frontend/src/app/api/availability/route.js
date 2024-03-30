import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export const dynamic = 'force-dynamic'

export async function GET() {
    const res = await fetch(`${DATA_SOURCE_URL}/availability`)
    const getAllAvailability = await res.json()

    return NextResponse.json(getAllAvailability)
}

export async function POST(req) {
    const { day, newTime, toRemoveTime, packageid } = await req.json()

    if (!day || !packageid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    try {
        var addedNewTimeResult, removedTimeResult, updatedDayResult

        if (newTime) {
            const newTimeResult = await Promise.all(newTime.map(async (timeItem) => {
                const newTimeRes = await fetch(`${DATA_SOURCE_URL}/availability/create`, {
                    method: 'POST',
                    headers: {
                        "Content-Type": "application/json",
                        'API-Key': process.env.DATA_API_KEY
                    },
                    body: JSON.stringify({
                        day: day,
                        time: timeItem,
                        status: 'Open',
                        packageid: packageid
                    })
                });

                const newTimeInfo = await newTimeRes.json()
                return newTimeInfo
            }));

            addedNewTimeResult = newTimeResult
        }

        if (toRemoveTime) {
            const removeTimeResult = await Promise.all(toRemoveTime.map(async (item) => {
                const removeTimeRes = await fetch(`${DATA_SOURCE_URL}/availability/${item.availabilityid}`, {
                    method: 'DELETE',
                    headers: {
                        "Content-Type": "application/json",
                        'API-Key': process.env.DATA_API_KEY
                    }
                });

                const removeTimeInfo = await removeTimeRes.json()
                return removeTimeInfo
            }));

            removedTimeResult = removeTimeResult
        }

        return NextResponse.json({ 'addedNewTimeResult': addedNewTimeResult, 'removedTimeResult': removedTimeResult, 'updatedDayResult': updatedDayResult })
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ "code": 500, "message": error })
    }
}

export async function PUT(req) {
    const { day, packageid } = await req.json()

    const updateDayRes = await fetch(`${DATA_SOURCE_URL}/availability/update_day`, {
        method: 'PUT',
        headers: {
            "Content-Type": "application/json",
            'API-Key': process.env.DATA_API_KEY
        },
        body: JSON.stringify({
            day: day,
            status: 'Open',
            packageid: packageid
        })
    });

    const updateDayInfo = await updateDayRes.json()

    return NextResponse.json(updateDayInfo)
}
