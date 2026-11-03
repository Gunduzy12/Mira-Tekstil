/* eslint-disable @typescript-eslint/no-require-imports -- Node's CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const pages = {
    contract: fs.readFileSync('app/mesafeli-satis-sozlesmesi/page.tsx', 'utf8'),
    preInfo: fs.readFileSync('app/on-bilgilendirme-formu/page.tsx', 'utf8'),
};
const checkout = fs.readFileSync('components/CheckoutContent.tsx', 'utf8');
const footer = fs.readFileSync('components/Footer.tsx', 'utf8');
const sitemap = fs.readFileSync('app/sitemap.ts', 'utf8');

for (const [name, source] of Object.entries(pages)) {
    test(`${name}: seller identity comes from businessInfo, not hardcoded`, () => {
        assert.match(source, /from '@\/data\/businessInfo'/);
        assert.match(source, /b\.taxId/);
        assert.ok(!/\b\d{10,11}\b/.test(source.replace(/905374009410/g, '')), 'a hardcoded tax/personal ID number is present');
    });

    test(`${name}: 14-day withdrawal applies to all products, custom size included`, () => {
        assert.match(source, /özel ölçüde dikilen perdeler dahil tüm ürünlerde/i);
        assert.match(source, /14 gün/);
        assert.ok(!/istisna/i.test(source), 'custom-size return exception must not come back');
    });

    test(`${name}: shipping figures come from the shared order policy`, () => {
        assert.match(source, /ORDER_FREE_SHIPPING_THRESHOLD/);
        assert.match(source, /ORDER_STANDARD_SHIPPING_COST/);
    });
}

test('checkout consent links to both legal pages', () => {
    assert.match(checkout, /href="\/on-bilgilendirme-formu"/);
    assert.match(checkout, /href="\/mesafeli-satis-sozlesmesi"/);
});

test('footer and sitemap list both legal pages', () => {
    for (const path of ['/on-bilgilendirme-formu', '/mesafeli-satis-sozlesmesi']) {
        assert.ok(footer.includes(`href="${path}"`), `footer is missing ${path}`);
        assert.ok(sitemap.includes(`\${baseUrl}${path}`), `sitemap is missing ${path}`);
    }
});
