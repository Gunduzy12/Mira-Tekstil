/* eslint-disable @typescript-eslint/no-require-imports -- Node's CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function loadModule(path, deps = {}) {
    const exports = {};
    const requireStub = name => deps[name] || {};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
    }).outputText, { exports, require: requireStub });
    return exports;
}

const expansion = loadModule('data/seoExpansion.ts');
const guideExtras = loadModule('data/seoGuideExtras.ts');
const guides = loadModule('data/seoGuideTopics.ts', { './seoGuideExtras': guideExtras });
const legacyExtras = loadModule('data/seoLegacyExtras.ts');
const blog = loadModule('data/seoBlogTopics.ts', {
    './seoLegacyExtras': legacyExtras,
    './seoExpansion': expansion,
    './seoGuideTopics': guides,
});
const categories = loadModule('data/seoCategories.ts');

const topics = blog.blogTopics;
const slugs = topics.map(topic => topic.slug);

test('blog slugs are unique and the blog has at least 20 posts', () => {
    assert.equal(new Set(slugs).size, slugs.length);
    assert.ok(topics.length >= 20, `only ${topics.length} posts`);
});

test('every post has a title, a meta description within limits, and an excerpt', () => {
    for (const topic of topics) {
        assert.ok(topic.title && topic.title.length <= 90, `${topic.slug}: title`);
        assert.ok(topic.metaDescription.length >= 60 && topic.metaDescription.length <= 160, `${topic.slug}: meta length ${topic.metaDescription.length}`);
        assert.ok(topic.excerpt.length > 20, `${topic.slug}: excerpt`);
        assert.ok(topic.content.length >= 4, `${topic.slug}: content too short`);
    }
});

test('list items and FAQ text contain no raw HTML (they are rendered as plain text)', () => {
    for (const topic of topics) {
        for (const block of topic.content) {
            for (const item of block.items || []) assert.ok(!/<[a-z][^>]*>/i.test(item), `${topic.slug}: HTML in list item`);
        }
        for (const entry of topic.faq || []) assert.ok(!/<[a-z][^>]*>/i.test(entry.answer), `${topic.slug}: HTML in faq`);
    }
});

test('guide posts are substantial (at least 450 words each)', () => {
    const guideSlugs = new Set(guides.seoGuideTopics.map(topic => topic.slug));
    const wordCount = topic => [
        ...topic.content.map(block => `${block.content || ''} ${(block.items || []).join(' ')}`),
        ...(topic.faq || []).map(entry => `${entry.question} ${entry.answer}`),
    ].join(' ').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    for (const topic of topics.filter(entry => guideSlugs.has(entry.slug))) {
        assert.ok(wordCount(topic) >= 450, `${topic.slug}: ${wordCount(topic)} words`);
    }
});

test('every post in the blog has at least 400 words', () => {
    const wordCount = topic => [
        ...topic.content.map(block => `${block.content || ''} ${(block.items || []).join(' ')}`),
        ...(topic.faq || []).map(entry => `${entry.question} ${entry.answer}`),
    ].join(' ').replace(/<[^>]*>/g, ' ').split(/\s+/).filter(Boolean).length;
    for (const topic of topics) assert.ok(wordCount(topic) >= 400, `${topic.slug}: ${wordCount(topic)} words`);
});

test('every post has a modified date and the new guides have a publish date', () => {
    const guideSlugs = new Set(guides.seoGuideTopics.map(topic => topic.slug));
    for (const topic of topics) {
        assert.match(topic.dateModified || '', /^\d{4}-\d{2}-\d{2}$/, `${topic.slug}: dateModified`);
        if (guideSlugs.has(topic.slug)) assert.match(topic.datePublished || '', /^\d{4}-\d{2}-\d{2}$/, `${topic.slug}: datePublished`);
        else assert.equal(topic.datePublished, undefined, `${topic.slug}: older posts must not get an invented publish date`);
    }
});

test('internal links in blog content and related links resolve', () => {
    const pagePaths = new Set([
        '/', '/perde', '/ev-tekstili', '/shop', '/blog', '/about', '/contact', '/iade-ve-geri-odeme',
        ...categories.seoCategories.map(category => `/${category.parentSlug}/${category.categorySlug}`),
        ...slugs.map(slug => `/blog/${slug}`),
    ]);
    const hrefs = [];
    for (const topic of topics) {
        for (const block of topic.content) {
            for (const match of (block.content || '').matchAll(/href="(\/[^"]*)"/g)) hrefs.push([topic.slug, match[1]]);
        }
        for (const link of topic.relatedLinks || []) hrefs.push([topic.slug, link.href]);
    }
    for (const [slug, href] of hrefs) assert.ok(pagePaths.has(href), `${slug}: broken internal link ${href}`);
});
