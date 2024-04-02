import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/calculatorapi/calculator/'

export const dynamic = 'force-dynamic';

export async function GET(req, context) {
    const { traineeid } = await context.params

    const res = await fetch(`${DATA_SOURCE_URL}/${traineeid}`)
    const getCalcResult = await res.json()

    return NextResponse.json(getCalcResult)
}