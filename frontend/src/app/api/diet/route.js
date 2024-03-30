import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/dietapi/diet/'

export async function GET(req) {

    // const { traineeId } = await req.json()

    const res = await fetch(`${DATA_SOURCE_URL}`)
    const getMeal = await res.json()
    console.log(req.query)

    return NextResponse.json(getMeal)
}