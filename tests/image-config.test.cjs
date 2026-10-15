const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const config = fs.readFileSync('next.config.ts', 'utf8')
    .split('\n')
    .filter(line => !line.trim().startsWith('//'))
    .join('\n');

test('image optimization stays enabled (550 KB originals must be resized and converted to WebP)', () => {
    assert.ok(!/unoptimized\s*:\s*true/.test(config), 'images.unoptimized: true serves full-size originals again');
});

test('optimized images use WebP and a long cache TTL', () => {
    assert.match(config, /formats\s*:\s*\[\s*'image\/webp'\s*\]/);
    assert.match(config, /minimumCacheTTL\s*:/);
});

test('Firebase Storage images remain allowed as remote sources', () => {
    assert.match(config, /remotePatterns/);
    assert.ok(/hostname:\s*'\*\*'/.test(config) || /firebasestorage\.googleapis\.com/.test(config));
});
