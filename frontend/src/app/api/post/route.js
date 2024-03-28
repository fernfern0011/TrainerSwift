import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/bookingapi'

export async function GET() {
    const res = await fetch(`${DATA_SOURCE_URL}/post`)
    const getAllPost = await res.json()

    return NextResponse.json(getAllPost)
}

export async function POST(req) {
    const { title, description, category, image, trainerid } = await req.json()

    if (!title || !description || !category || !trainerid) return NextResponse.json({ "code": 400, "message": "Missing required data" })

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

export async function DELETE(req) {
    const { postid } = await req.json()
    
    if (!postid) return NextResponse.json({ "code": 400, "message": "Failed to delete post" })

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