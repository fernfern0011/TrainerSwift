import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/websocketapi'

export async function GET() {
    const res = await fetch(`${DATA_SOURCE_URL}/getchats`)
    const getAllMessages = await res.json()

    return NextResponse.json(getAllMessages)
}

export async function POST(req) {
    const { trainerID, traineeID, connection, message, sender} = await req.json()

    if (!trainerID || !traineeID || !message || !sender ) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    const res = await fetch(`${DATA_SOURCE_URL}/websocketchat`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'API-Key': process.env.DATA_API_KEY
        },
        body: JSON.stringify({
            trainerID: trainerID,
            traineeID: traineeID,
            connection: connection,
            message: message,
            sender: "trainee"
        })
    })

    const result = await res.json()
    return NextResponse.json(result)
}

