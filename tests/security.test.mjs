import test from 'node:test';
import assert from 'node:assert/strict';
import { loadTs } from './load-ts.mjs';

const { sanitizeArticleHtml } = await loadTs('lib/sanitize.ts');
const { createArticleSchema, passwordSchema } = await loadTs('lib/validation.ts');
const { readJson, articleIdFrom, readBody } = await loadTs('lib/http.ts');
const { consumeRateLimit, clearRateLimit } = await loadTs('lib/rate-limit.ts');
const { resourceImage, FALLBACK_IMAGE } = await loadTs('lib/resource-image.ts');
const { allowedRequestOrigin } = await loadTs('lib/request-origin.ts');
const { articleDate } = await loadTs('lib/article-date.ts');

test('publication dates preserve the selected China calendar day around midnight', () => {
    assert.equal(articleDate('2021-08-09T16:00:00.000Z'), '2021-08-10');
    assert.equal(articleDate('2021-08-10T15:59:59.000Z'), '2021-08-10');
});

test('origin check supports loopback and configured HTTPS without trusting forwarded hosts', () => {
    assert.equal(allowedRequestOrigin('http://127.0.0.1:3100', '127.0.0.1:3100', 'http:'), true);
    assert.equal(allowedRequestOrigin('https://blog.example', 'localhost:3000', 'http:', 'https://blog.example'), true);
    assert.equal(allowedRequestOrigin('https://foreign.example', 'localhost:3000', 'http:', 'https://blog.example'), false);
    assert.equal(allowedRequestOrigin('null', 'localhost:3000', 'http:'), false);
});

test('article HTML retains useful elements and strips executable payloads', () => {
    const output = sanitizeArticleHtml(
        '<h2 id="intro">标题</h2><pre><code>const a = 1;</code></pre><table><tr><td>数据</td></tr></table><script>alert(1)</script><svg><animate onbegin="alert(1)"/></svg><img src="/safe.webp" onerror="alert(1)"><a href="javascript:alert(1)" target="_blank">链接</a><iframe src="https://evil.invalid"></iframe>'
    );
    assert.match(output, /<h2 id="intro">/);
    assert.match(output, /<table>/);
    assert.match(output, /<pre>/);
    assert.doesNotMatch(output, /script|svg|animate|onerror|javascript:|iframe/);
    assert.match(output, /noopener noreferrer/);
});
test('article URLs reject active schemes, protocol-relative URLs, and credentials', () => {
    for (const url of ['javascript:alert(1)', '//evil.invalid/x', 'https://user:secret@example.com/a', '/\\evil.invalid']) {
        assert.equal(createArticleSchema.safeParse({ title: '安全', content: '<p>正文</p>', coverImage: url }).success, false);
        assert.equal(resourceImage(url), FALLBACK_IMAGE);
    }
    assert.equal(resourceImage('Vue'), '/icon/Vue.webp');
    assert.equal(resourceImage('/api/media/test.webp'), '/api/media/test.webp');
});
test('password policy rejects bcrypt truncation in multibyte passwords', () => {
    assert.equal(passwordSchema.safeParse({ currentPassword: 'old-password', newPassword: '汉'.repeat(25) }).success, false);
    assert.equal(passwordSchema.safeParse({ currentPassword: 'old-password', newPassword: '汉'.repeat(24) }).success, true);
});
test('JSON parser handles malformed bodies and rejects oversized streamed requests', async () => {
    await assert.rejects(() => readJson(new Request('http://local', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{broken' }), createArticleSchema), /JSON/);
    await assert.rejects(() => readJson(new Request('http://local', { method: 'POST', body: '{}' }), createArticleSchema), /JSON/);
    await assert.rejects(
        () => readBody(new Request('http://local', { method: 'POST', body: '12345' }), 4),
        (error) => error.status === 413
    );
    assert.equal(articleIdFrom('21'), 21);
    for (const value of ['1e2', '-1', '0', '999999999999999999']) assert.throws(() => articleIdFrom(value));
});
test('single-instance limiter blocks repeated writes and can reset a key', () => {
    const key = 'test-' + Date.now();
    assert.equal(consumeRateLimit(key, 1, 10000).allowed, true);
    assert.equal(consumeRateLimit(key, 1, 10000).allowed, false);
    clearRateLimit(key);
    assert.equal(consumeRateLimit(key, 1, 10000).allowed, true);
    clearRateLimit(key);
});
