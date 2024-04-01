import { NextResponse } from 'next/server'
var jwt = require('jsonwebtoken');

const DATA_SOURCE_URL = 'http://localhost:8000/traineeapi'

export const dynamic = 'force-dynamic'

export async function POST(req) {
    const { email, password } = await req.json()

    if (!email || !password) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    try {
        const res = await fetch(`${DATA_SOURCE_URL}/trainee/login`, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                'API-Key': process.env.DATA_API_KEY
            },
            body: JSON.stringify({
                email: email.toLowerCase(),
                password: password.toLowerCase()
            })
        })

        const result = await res.json()

        if (result.code == '201') {
            const traineeinfo = {
                role: 'trainee',
                traineeid: result.data.trainee.traineeid,
                name: result.data.trainee.name,
            }

            // create session
            var token = jwt.sign({ traineeinfo: traineeinfo }, process.env.JWT_SECRET, {
                expiresIn: 86400 //expires in 24 hrs
            });

            return NextResponse.json({ "code": 201, token, traineeinfo })
        } else {
            return NextResponse.json(result)
        }

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json({ "code": 500, "message": error })
    }
}