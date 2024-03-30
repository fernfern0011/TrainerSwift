import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi/trainee'

export async function GET(req, context) {
    const { traineeid } = await context.params
    console.log(traineeid)
    
    const res = await fetch(`${DATA_SOURCE_URL}/${traineeid}/bookedbydetails`)
    const getUser = await res.json()

    return NextResponse.json(getUser)
}


