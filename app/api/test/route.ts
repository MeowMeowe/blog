import { NextResponse } from 'next/server';

export async function GET() {
    try {
        return NextResponse.json({
            code: 200,
            data: { message: 'Test API works!' },
            msg: 'success'
        });
    } catch (error) {
        return NextResponse.json(
            {
                code: 500,
                data: null,
                msg: 'Test API failed'
            },
            { status: 500 }
        );
    }
}
