import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export const dynamic = 'force-dynamic'

export async function GET(req, context) {
    const { postid } = await context.params

    if (!postid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    const res = await fetch(`${DATA_SOURCE_URL}/post/${postid}`)
    const getPost = await res.json()

    return NextResponse.json(getPost)
}

