import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/trainerapi/trainerinfo'

export const dynamic = 'force-dynamic'

export async function GET(req, context) {
    // console.log(context.params.trainerid)
    const { trainerid } = await context.params
    console.log(trainerid)
    
    const res = await fetch(`${DATA_SOURCE_URL}/${trainerid}`)
    const getUser = await res.json()

    return NextResponse.json(getUser)
}

