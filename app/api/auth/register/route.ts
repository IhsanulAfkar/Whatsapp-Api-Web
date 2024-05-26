import { NextRequest, NextResponse } from "next/server";
export const POST = async (request: NextRequest) => {
    const body = await request.json()

    try {
        const result = await fetch(process.env.BACKEND_URL + '/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        })
        const message = await result.json()
        if (!result.ok) {
            return NextResponse.json({ message: message.error }, { status: 400 })
        }
        return NextResponse.json({ message: message }, { status: 200 })
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 500 })
    }
}