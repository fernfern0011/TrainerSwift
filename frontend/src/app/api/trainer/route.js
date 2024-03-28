import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/trainerapi/trainerinfo'

export async function GET(req) {

    // const { trainerId } = await req.json()

    const res = await fetch(`${DATA_SOURCE_URL}`)
    const getUser = await res.json()
    console.log(req.query)

    return NextResponse.json(getUser)
}


