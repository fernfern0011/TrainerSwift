import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi/trainer'

export async function GET(req, context) {
    const { trainerid } = await context.params
    console.log(trainerid)
    
    const res = await fetch(`${DATA_SOURCE_URL}/${trainerid}/bookedby`)
    const getUser = await res.json()

    return NextResponse.json(getUser)
}
