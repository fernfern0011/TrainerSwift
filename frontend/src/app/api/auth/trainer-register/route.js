import { NextResponse } from 'next/server'

const DATA_SOURCE_URL = 'http://localhost:8000/trainerapi'

export const dynamic = 'force-dynamic'

export async function POST(req) {
    const { username, email, password, name } = await req.json()

    if (!username || !email || !password || !name) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    const res = await fetch(`${DATA_SOURCE_URL}/trainer/create`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
            'API-Key': process.env.DATA_API_KEY
        },
        body: JSON.stringify({
            username: username,
            email: email,
            password: password,
            name: name
        })
    })

    const result = await res.json()
    return NextResponse.json(result)
}