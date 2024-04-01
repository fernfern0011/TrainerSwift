import { NextResponse } from "next/server";

const DATA_SOURCE_URL = 'http://localhost:8000/checkingdietapi/check_my_diet'

export const dynamic = 'force-dynamic';

export async function DELETE(req) {
    const { mealid } = await req.json();

    const deleteData = {
        mealid: mealid,
        method_used: "DELETE"
    }

    const requestOptions = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(deleteData)
    };

    try {
        const response = await fetch(DATA_SOURCE_URL, requestOptions); // Send POST request to the correct endpoint
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        sessionStorage.setItem('calcData', JSON.stringify(data));
        return NextResponse.json(data);

    } catch (error) {
        console.error('Error:', error);
        // Handle error appropriately
        return NextResponse.error(error.message, { status: 500 });
    }
}
