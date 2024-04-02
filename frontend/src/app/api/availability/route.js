import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export const dynamic = 'force-dynamic'

export async function GET() {
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
            const res = await fetch(`${DATA_SOURCE_URL}/availability`)
            const getAllAvailability = await res.json()

            return NextResponse.json(getAllAvailability)
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}

export async function POST(req) {
    const { day, time, newTime, toRemoveTime, packageid } = await req.json()

    if (!day || !packageid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

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
            var addedNewTimeResult, removedTimeResult, updatedDayResult, availabilityResult

            if (time) {
                const addTimeResult = await Promise.all(time.map(async (timeItem) => {
                    const addTimeRes = await fetch(`${DATA_SOURCE_URL}/availability/create`, {
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

                    const timeInfo = await addTimeRes.json()
                    return timeInfo
                }));

                availabilityResult = addTimeResult
            }

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

            return NextResponse.json({ 'addedNewTimeResult': addedNewTimeResult, 'removedTimeResult': removedTimeResult, 'updatedDayResult': updatedDayResult, 'availabilityResult': availabilityResult })
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}

export async function PUT(req) {
    const { day, packageid } = await req.json()

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
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}
