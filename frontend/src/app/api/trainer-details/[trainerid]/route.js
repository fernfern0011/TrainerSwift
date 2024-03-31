import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi/trainer'

export const dynamic = 'force-dynamic'


export async function GET(req, context) {
    const { trainerid } = await context.params
    console.log(trainerid)
    
    const res = await fetch(`${DATA_SOURCE_URL}/${trainerid}/bookedbydetails`)
    const getUser = await res.json()

    return NextResponse.json(getUser)
}


