import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export async function GET(req, context) {
    const { postid } = await context.params

    const res = await fetch(`${DATA_SOURCE_URL}/post/${postid}/package`)
    const getPackage = await res.json()

    return NextResponse.json(getPackage)
}

