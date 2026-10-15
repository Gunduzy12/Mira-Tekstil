/* eslint-disable @typescript-eslint/no-require-imports -- Node's CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

function load(path) {
    const exports = {};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync(path, 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
    }).outputText, { exports });
    return exports;
}
const seo = load('data/seoCategories.ts');

// Gerçek ürün adlarının kısaltılmış örnekleri
const products = [
    { name: 'Özel Dikim 1.Sınıf Bej Blackout Işık Geçirmez Fon Perde' },
    { name: 'Lüks 1. Sınıf Özel Dikim Gri Blackout Işık Geçirmez Fon Perde' },
    { name: 'Lüks 1. Sınıf Özel Dikim Lacivert Blackout Işık Geçirmez Fon Perde' },
    { name: 'Özel Dikim 1.Sınıf Siyah Blackout Işık Geçirmez Fon Perde' },
    { name: 'Özel Dikim 1.Sınıf Antrasit Blackout Işık Geçirmez Fon Perde' },
    { name: 'Lüks 1. Sınıf Özel Dikim Kahverengi Blackout Işık Geçirmez Fon Perde' },
    { name: 'Özel Dikim 1.Sınıf Vizon Blackout Işık Geçirmez Fon Perde' },
    { name: 'Lüks 1. Sınıf Özel Dikim Beyaz Saten Perde' },
    { name: 'Lüks 1. Sınıf Özel Dikim Krem Saten Perde' },
    { name: 'Lüks Elegance 1/3 Sık Pileli Çizgili Tül Perde' },
    { name: 'Lüks 1.Sınıf 1.Kalite Gri-Beyaz EnxBoy Bağcıklı Balkon Perdesi' },
    { name: 'Lüks 1. Sınıf Kalite Koruma Cibinliği Uyku Tülü' },
    { name: '8+2 Hediyeli 10 Adet Beyaz Fermuarlı Yastık Kılıfı 50x70 Cm' },
];
const names = (slug) => seo.filterProductsBySubcategory(products, slug).map(p => p.name);

test('bedroom collection has blackout and satin curtains only', () => {
    const result = names('yatak-odasi-perdesi');
    assert.equal(result.length, 9);
    assert.ok(result.every(n => /Blackout|Saten/.test(n)));
});

test('dark and light collections split by color and never include balcony, mosquito net or pillow products', () => {
    const dark = names('koyu-renk-perde');
    const light = names('acik-renk-perde');
    assert.equal(dark.length, 4);
    assert.equal(light.length, 5);
    for (const n of [...dark, ...light]) assert.ok(!/Balkon|Cibinlik|Yastık/i.test(n), n);
    assert.equal(dark.filter(n => light.includes(n)).length, 0);
});

test('living room collection includes satin, tulle and dark navy/anthracite curtains', () => {
    const result = names('salon-perdesi');
    assert.ok(result.some(n => /Saten/.test(n)));
    assert.ok(result.some(n => /Tül Perde/.test(n)));
    assert.ok(!result.some(n => /Cibinlik|Balkon/i.test(n)));
});

test('new collection categories are registered, unique and linked from the parent category', () => {
    const slugs = ['yatak-odasi-perdesi', 'salon-perdesi', 'koyu-renk-perde', 'acik-renk-perde'];
    const parent = seo.seoParentCategories.find(entry => entry.slug === 'perde');
    for (const slug of slugs) {
        const matches = seo.seoCategories.filter(c => c.categorySlug === slug);
        assert.equal(matches.length, 1, slug);
        assert.ok(parent.children.some(child => child.slug === slug), `${slug} missing from parent navigation`);
        const category = matches[0];
        assert.ok(category.title.length <= 70, `${slug} title ${category.title.length}`);
        assert.ok(category.metaDescription.length >= 60 && category.metaDescription.length <= 160, `${slug} meta ${category.metaDescription.length}`);
        assert.ok(category.faq.length >= 3);
    }
});
