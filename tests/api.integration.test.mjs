import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { unlink } from 'node:fs/promises';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import sharp from 'sharp';

const base = process.env.TEST_BASE_URL;
test('admin, article lifecycle, media and session regression', { skip: !base, timeout: 120000 }, async () => {
    if (!['localhost', '127.0.0.1', '[::1]'].includes(new URL(base).hostname)) throw new Error('Integration tests only run against localhost.');
    const prisma = new PrismaClient();
    const key = randomUUID();
    const password = 'test-' + randomUUID();
    const user = await prisma.user.create({ data: { username: 'test-' + key, email: key + '@tests.invalid', passwordHash: await hash(password, 12), role: 'ADMIN' } });
    let articleId, mediaPath, tagId, techId;
    const cookies = new Map();
    async function request(endpoint, init = {}, anonymous = false) {
        const response = await fetch(new URL(endpoint, base), {
            ...init,
            redirect: 'manual',
            headers: { Origin: new URL(base).origin, ...(anonymous ? {} : { Cookie: [...cookies].map(([key, value]) => key + '=' + value).join('; ') }), ...init.headers }
        });
        if (!anonymous)
            for (const cookie of response.headers.getSetCookie()) {
                const [pair] = cookie.split(';');
                const index = pair.indexOf('=');
                cookies.set(pair.slice(0, index), pair.slice(index + 1));
            }
        return response;
    }
    const json = (method, body) => ({ method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    try {
        assert.equal((await request('/api/admin/articles', {}, true)).status, 401);
        assert.equal((await request('/admin', {}, true)).status, 404);
        const adminPath = process.env.ADMIN_PATH || '/backstage';
        assert.equal((await request(adminPath + '/login', {}, true)).status, 200);
        assert.equal((await request(adminPath + '/articles', {}, true)).status, 307);
        assert.equal((await request('/api/auth/signin', {}, true)).status, 404);
        assert.equal((await request('/api/articles/create', { method: 'POST', headers: { Origin: 'https://foreign.invalid' } }, true)).status, 403);
        const csrf = await (await request('/api/auth/csrf')).json();
        const login = await request('/api/auth/callback/credentials', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ csrfToken: csrf.csrfToken, email: user.email, password, json: 'true' })
        });
        assert.equal(login.status, 200);
        assert.equal((await request('/api/admin/profile')).status, 200);
        const profile = await request('/api/admin/profile', json('PUT', { displayName: 'Regression user', avatarUrl: '/img/cat.png' }));
        assert.equal(profile.status, 200);
        assert.equal((await (await request('/api/admin/profile')).json()).data.displayName, 'Regression user');
        assert.equal((await (await request('/api/auth/session')).json()).user.name, 'Regression user');
        const tagResponse = await request('/api/tags', json('POST', { name: key, slug: key, color: '#16856d' }));
        assert.equal(tagResponse.status, 200);
        tagId = (await tagResponse.json()).data.id;
        assert.equal((await request('/api/tags', json('POST', { name: key, slug: key }))).status, 409);
        assert.equal((await request('/api/admin/tags/' + tagId, json('PUT', { description: 'Updated tag' }))).status, 200);
        const techResponse = await request('/api/admin/tech-stack', json('POST', { name: key, link: 'https://example.com' }));
        assert.equal(techResponse.status, 200);
        techId = (await techResponse.json()).data.id;
        assert.equal((await request('/api/admin/tech-stack/' + techId, json('PUT', { description: 'Updated tech' }))).status, 200);
        const malformed = await request('/api/articles/create', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{bad' });
        assert.equal(malformed.status, 400);
        const created = await request(
            '/api/articles/create',
            json('POST', {
                title: 'Regression ' + key,
                content: '<h2>Test</h2><p>content</p><script>alert(1)</script>',
                status: 'PUBLISHED',
                publishedAt: '2021-08-09T16:00:00.000Z',
                coverImage: '/icon/Nextjs.webp',
                tagIds: [tagId],
                techStackIds: [techId],
                links: [{ title: 'Docs', url: 'https://example.com', type: 'DOCS' }]
            })
        );
        assert.equal(created.status, 200, await created.clone().text());
        const article = (await created.json()).data;
        articleId = article.id;
        const before = await prisma.article.findUnique({ where: { id: articleId } });
        assert.doesNotMatch(before.content, /<script/);
        assert.equal((await request('/api/admin/tags/' + tagId, { method: 'DELETE' })).status, 409);
        assert.equal((await request('/api/admin/tech-stack/' + techId, { method: 'DELETE' })).status, 409);
        const filtered = (await (await request('/api/articles?' + new URLSearchParams({ search: key, tag: key }), {}, true)).json()).data;
        assert.equal(filtered.pagination.total, 1);
        assert.equal(filtered.articles[0].time, '2021-08-10');
        assert.equal(filtered.articles[0].cover, '/icon/Nextjs.webp');
        const adminFiltered = (await (await request('/api/admin/articles?' + new URLSearchParams({ search: key, status: 'PUBLISHED' }))).json()).data;
        assert.equal(adminFiltered.pagination.total, 1);
        const noResults = (await (await request('/api/articles?search=no-results-' + key, {}, true)).json()).data;
        assert.equal(noResults.pagination.total, 0);
        for (const route of ['/articles/' + articleId, '/sitemap.xml', '/feed.xml', '/robots.txt']) {
            assert.equal((await request(route, {}, true)).status, 200, route);
        }
        const detail = await request('/api/article/detail/' + articleId, {}, true);
        assert.equal(detail.status, 200);
        assert.equal((await detail.json()).data.time, '2021-08-10');
        await request('/api/article/detail/' + articleId, {}, true);
        let after = await prisma.article.findUnique({ where: { id: articleId } });
        assert.equal(after.viewCount, before.viewCount);
        assert.equal(+after.updatedAt, +before.updatedAt);
        const view = await request('/api/article/view/' + articleId, { method: 'POST' }, true);
        assert.equal(view.status, 200);
        await request('/api/article/view/' + articleId, { method: 'POST' }, true);
        after = await prisma.article.findUnique({ where: { id: articleId } });
        assert.equal(after.viewCount, before.viewCount + 1);
        assert.equal(+after.updatedAt, +before.updatedAt);
        const writes = await Promise.all(['one', 'two'].map((title) => request('/api/articles/' + articleId, json('PUT', { title, expectedVersion: article.version }))));
        assert.deepEqual(writes.map((result) => result.status).sort(), [200, 409]);
        const revisions = (await (await request('/api/admin/articles/' + articleId + '/revisions')).json()).data;
        assert.equal(revisions.length, 1);
        assert.equal((await request('/api/articles/' + articleId, { method: 'DELETE' })).status, 200);
        assert.equal((await request('/api/article/detail/' + articleId, {}, true)).status, 404);
        assert.equal((await request('/api/admin/articles/' + articleId + '/restore', { method: 'POST' })).status, 200);
        let current = (await (await request('/api/admin/articles/' + articleId)).json()).data;
        assert.equal(current.status, 'DRAFT');
        assert.equal((await request('/api/article/detail/' + articleId, {}, true)).status, 404);
        const restored = await request('/api/admin/articles/' + articleId + '/revisions/' + revisions[0].id + '/restore', json('POST', { expectedVersion: current.version }));
        assert.equal(restored.status, 200);
        current = (await restored.json()).data;
        assert.equal(current.title, article.title);
        assert.equal(current.status, 'DRAFT');
        assert.deepEqual(current.tagIds, [tagId]);
        assert.deepEqual(current.techStackIds, [techId]);
        assert.equal(current.links[0].title, 'Docs');
        const archived = await request('/api/articles/' + articleId, json('PUT', { status: 'ARCHIVED', expectedVersion: current.version }));
        assert.equal(archived.status, 200);
        assert.equal((await request('/api/article/detail/' + articleId, {}, true)).status, 404);
        const badFile = new FormData();
        badFile.set('file', new Blob(['<svg onload="alert(1)"/>'], { type: 'image/png' }), 'fake.png');
        assert.equal((await request('/api/admin/media', { method: 'POST', body: badFile })).status, 400);
        const image = await sharp({ create: { width: 20, height: 20, channels: 3, background: '#228866' } })
            .png()
            .toBuffer();
        const form = new FormData();
        form.set('file', new Blob([image], { type: 'image/png' }), 'test.png');
        const uploaded = await request('/api/admin/media', { method: 'POST', body: form });
        assert.equal(uploaded.status, 200, await uploaded.clone().text());
        const file = (await uploaded.json()).data;
        mediaPath = path.resolve(process.env.MEDIA_ROOT || '.storage/media', file.name);
        assert.equal((await request(file.url, {}, true)).headers.get('content-type'), 'image/webp');
        const exportResult = await request('/api/admin/export');
        assert.equal(exportResult.status, 200);
        assert.doesNotMatch(await exportResult.text(), /passwordHash|password_hash/);
        await prisma.user.update({ where: { id: user.id }, data: { role: 'EDITOR' } });
        assert.equal((await request('/api/admin/profile')).status, 200);
        assert.equal((await request('/api/tags', json('POST', { name: key, slug: key }))).status, 403);
        assert.equal((await request('/api/admin/export')).status, 403);
        assert.equal((await request('/api/admin/articles?deleted=true')).status, 403);
        assert.equal((await request('/api/articles/' + articleId, { method: 'DELETE' })).status, 403);
        await prisma.user.update({ where: { id: user.id }, data: { role: 'ADMIN' } });
        // Remove only this test's article before exercising unused-taxonomy deletion.
        await prisma.article.delete({ where: { id: articleId } });
        articleId = undefined;
        assert.equal((await request('/api/admin/tags/' + tagId, { method: 'DELETE' })).status, 200);
        assert.equal((await request('/api/admin/tech-stack/' + techId, { method: 'DELETE' })).status, 200);
        const passwordUpdate = await request('/api/admin/password', json('PUT', { currentPassword: password, newPassword: 'new-' + password }));
        assert.equal(passwordUpdate.status, 200);
        assert.equal((await request('/api/admin/profile')).status, 401);
    } finally {
        if (articleId) await prisma.article.deleteMany({ where: { id: articleId, authorId: user.id } });
        if (tagId) await prisma.tag.deleteMany({ where: { id: tagId, slug: key } });
        if (techId) await prisma.techStack.deleteMany({ where: { id: techId, name: key } });
        await prisma.user.delete({ where: { id: user.id } });
        if (mediaPath) await unlink(mediaPath);
        await prisma.$disconnect();
    }
});
