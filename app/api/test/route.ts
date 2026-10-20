export function GET() {
    return new Response(null, {
        status: 404,
        headers: {
            'Cache-Control': 'no-store'
        }
    });
}
