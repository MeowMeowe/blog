import path from 'node:path';
import { mkdir, readdir, stat, writeFile } from 'node:fs/promises';
import { randomUUID } from 'node:crypto';
import sharp from 'sharp';
import { RequestError } from './http';

export const mediaRoot = path.resolve(process.env.MEDIA_ROOT || '.storage/media');
export const mediaName = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}\.webp$/;
export const maxImageBytes = 5 * 1024 * 1024;

export async function listMedia() {
    await mkdir(mediaRoot, { recursive: true });
    const names = (await readdir(mediaRoot)).filter((name) => mediaName.test(name));
    const files = await Promise.all(
        names.map(async (name) => {
            const info = await stat(path.join(mediaRoot, name));
            return { name, url: `/api/media/${name}`, size: info.size, createdAt: info.mtime.toISOString() };
        })
    );
    return files.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function storeImage(file: File) {
    if (file.size > maxImageBytes) throw new RequestError('图片最大为 5 MB', 413);
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(file.type)) throw new RequestError('仅支持 JPEG、PNG、WebP、GIF 图片');
    const input = Buffer.from(await file.arrayBuffer());
    let output: Buffer;
    try {
        const image = sharp(input, { limitInputPixels: 40_000_000, failOn: 'warning' });
        const info = await image.metadata();
        if (!info.format || !['jpeg', 'png', 'webp', 'gif'].includes(info.format)) throw new Error('Unsupported format');
        // Re-encode pixels only; metadata and embedded payloads are not copied. GIF uses its first frame.
        output = await image.rotate().resize({ width: 2400, height: 2400, fit: 'inside', withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    } catch {
        throw new RequestError('图片无法解码或尺寸过大，请换一张图片');
    }
    await mkdir(mediaRoot, { recursive: true });
    if ((await readdir(mediaRoot)).length >= 2000) throw new RequestError('媒体数量已达上限，请先整理存储空间', 409);
    const name = `${randomUUID()}.webp`;
    await writeFile(path.join(mediaRoot, name), output, { flag: 'wx', mode: 0o600 });
    return { name, url: `/api/media/${name}`, size: output.length, createdAt: new Date().toISOString() };
}
