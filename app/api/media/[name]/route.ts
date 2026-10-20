import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { mediaRoot, mediaName } from '@/lib/media';

export const runtime = 'nodejs';
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
    const { name } = await params;
    if (!mediaName.test(name)) return new Response(null, { status: 404 });
    try {
        const bytes = await readFile(path.join(mediaRoot, name));
        return new Response(new Uint8Array(bytes), {
            headers: { 'Content-Type': 'image/webp', 'X-Content-Type-Options': 'nosniff', 'Cache-Control': 'public, max-age=31536000, immutable' }
        });
    } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return new Response(null, { status: 404 });
        return new Response(null, { status: 500 });
    }
}
