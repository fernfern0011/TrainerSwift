import jwt from 'jsonwebtoken'
import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export const dynamic = 'force-dynamic'

export async function GET(req) {
    const url = new URL(req.url)
    const searchParam = new URLSearchParams(url.searchParams)
    const trainerid = searchParam.get('trainerid')

    if (!trainerid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    try {
        const headersInstance = headers()
        const authHeader = headersInstance.get('Authorization')

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else {
            const res = await fetch(`${DATA_SOURCE_URL}/trainer/${trainerid}/post`)
            const getAllPostByTrainerid = await res.json()

            return NextResponse.json(getAllPostByTrainerid)
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}

export async function POST(req) {
    const { title, description, category, image, trainerid } = await req.json()

    if (!title || !description || !category || !trainerid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    try {
        const headersInstance = headers()
        const authHeader = headersInstance.get('Authorization')

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else {
            const res = await fetch(`${DATA_SOURCE_URL}/post/create`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    'API-Key': process.env.DATA_API_KEY
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    category: category,
                    trainerid: trainerid,
                    image: image
                })
            })

            const result = await res.json()
            return NextResponse.json(result)
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}

export async function PUT(req) {
    const { title, description, category, image, trainerid, postid } = await req.json()

    if (!title || !description || !category || !trainerid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

    try {
        const headersInstance = headers()
        const authHeader = headersInstance.get('Authorization')

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else {
            const res = await fetch(`${DATA_SOURCE_URL}/post/${postid}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    'API-Key': process.env.DATA_API_KEY
                },
                body: JSON.stringify({
                    title: title,
                    description: description,
                    category: category,
                    image: image,
                    trainerid: trainerid
                })
            })

            const result = await res.json()
            return NextResponse.json(result)
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}

export async function DELETE(req) {
    const { postid } = await req.json()

    if (!postid) return NextResponse.json({ "code": 400, "message": "Failed to delete post" })

    try {
        const headersInstance = headers()
        const authHeader = headersInstance.get('Authorization')

        const token = authHeader.split(' ')[1]
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        if (!decoded) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else if (decoded.exp < Math.floor(Date.now() / 1000)) {
            return NextResponse.json({ "code": 400, "message": "Expired" })
        } else {
            const res = await fetch(`${DATA_SOURCE_URL}/post/${postid}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    'API-Key': process.env.DATA_API_KEY
                },
                body: JSON.stringify({
                    postid: postid
                })
            })

            const result = await res.json()
            return NextResponse.json(result)
        }
    } catch (error) {
        console.error('Token verification failed', error)
        return NextResponse.json({ "code": 400, "message": "Unauthorized" })
    }
}