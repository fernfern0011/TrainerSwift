import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/dietapi/diet/'

export async function GET(req, context) {
    const { traineeid } = await context.params

    const res = await fetch(`${DATA_SOURCE_URL}/${traineeid}/all`)
    const getMeal = await res.json()
    
    return NextResponse.json(getMeal)
}
