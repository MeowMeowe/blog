import test from 'node:test';
import assert from 'node:assert/strict';
import { access } from 'node:fs/promises';
import { articles } from '../database/content.mjs';
import { loadTs } from './load-ts.mjs';

const { sanitizeArticleHtml } = await loadTs('lib/sanitize.ts');
const knownTags = new Set([
    'p',
    'figure',
    'img',
    'figcaption',
    'blockquote',
    'nav',
    'strong',
    'ol',
    'li',
    'a',
    'section',
    'h2',
    'h3',
    'code',
    'ul',
    'aside',
    'pre',
    'div',
    'table',
    'thead',
    'tr',
    'th',
    'tbody',
    'td',
    'span',
    'em',
    'br'
]);

test('article source has unique IDs, valid publication dates and local illustrations', async () => {
    assert.equal(articles.length, 33);
    assert.equal(new Set(articles.map((article) => article.id)).size, articles.length);
    for (const article of articles) {
        assert.match(article.publishedAt, /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        assert.ok(Number.isFinite(Date.parse(article.publishedAt.replace(' ', 'T') + '+08:00')));
        for (const match of article.content.matchAll(/<img\b[^>]*\bsrc="([^"]+)"/g)) {
            assert.ok(match[1].startsWith('/icon/'), `Unexpected article illustration: ${article.id}`);
            await access(new URL(`../public${match[1]}`, import.meta.url));
        }
    }
});

test('article markup escapes technical angle brackets and keeps every TOC target after sanitization', () => {
    for (const article of articles) {
        for (const match of article.content.matchAll(/<\/?([A-Za-z][^\s>/]*)/g)) {
            assert.ok(knownTags.has(match[1].toLowerCase()), `Unescaped prose markup in article ${article.id}: ${match[1]}`);
        }
        const sanitized = sanitizeArticleHtml(article.content);
        const headings = [...sanitized.matchAll(/<h2 id="([^"]+)"/g)].map((match) => match[1]);
        assert.equal(new Set(headings).size, headings.length, `Duplicate heading IDs: ${article.id}`);
        for (const match of sanitized.matchAll(/href="#([^"]+)"/g)) {
            assert.ok(headings.includes(match[1]), `Missing TOC target: ${article.id}/${match[1]}`);
        }
        for (const tag of ['pre', 'table', 'figure']) {
            const count = (html) => [...html.matchAll(new RegExp(`<${tag}[\\s>]`, 'g'))].length;
            assert.equal(count(sanitized), count(article.content), `${tag} lost during sanitization: ${article.id}`);
        }
    }
    assert.match(sanitizeArticleHtml(articles.find((article) => article.id === 3).content), /ApiResult&lt;T&gt;/);
    assert.match(sanitizeArticleHtml(articles.find((article) => article.id === 21).content), /&lt;all_urls&gt;/);
    assert.match(sanitizeArticleHtml(articles.find((article) => article.id === 28).content), /Record&lt;string, any&gt;/);
});

test('unfinished personal retrospectives remain explicit outlines', () => {
    const outlines = articles.filter((article) => article.title.includes('（提纲）'));
    assert.deepEqual(
        outlines.map((article) => article.id),
        [6, 11, 19, 25, 32]
    );
    for (const article of outlines) assert.match(article.content, /待补|自己补/);
});
