/* eslint-disable @typescript-eslint/no-require-imports -- Node's CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { execFileSync } = require('node:child_process');

function load(source) {
    const exports = {};
    vm.runInNewContext(ts.transpileModule(source, {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
    }).outputText, { exports });
    return exports;
}
const current = load(fs.readFileSync('data/seoCategories.ts', 'utf8'));
const previous = load(execFileSync('git', ['show', 'HEAD:data/seoCategories.ts'], { encoding: 'utf8' }));

test('special-size collection excludes unrelated and non-custom products', () => {
    const products = [
        { name: 'Blackout Perde', isCustomSize: true },
        { name: 'Saten Perde', isCustomSize: false },
        { name: 'Yastık Kılıfı', isCustomSize: true },
        { name: 'Cibinlik Uyku Tülü Perde', isCustomSize: true },
    ];
    assert.equal(current.filterProductsBySubcategory(products, 'ozel-olcu-perde').length, 1);
});

test('balcony collection only contains balcony products', () => {
    const products = [{ name: 'Mavi-Beyaz Balkon Perdesi' }, { name: 'Siyah Blackout Perde' }];
    assert.equal(current.filterProductsBySubcategory(products, 'balkon-perdesi').length, 1);
});

test('existing product URL detection remains unchanged', () => {
    for (const name of ['Bej Blackout Perde', 'Mavi-Beyaz Balkon Perdesi', 'Tül Perde', 'Beyaz Saten Perde', 'Yastık Kılıfı']) {
        for (const args of [[name, 'id123', 'Perde'], [name, 'id123', 'Perde', 'existing-product', 'blackout-perde', 'perde']]) {
            assert.equal(current.getProductUrl(...args), previous.getProductUrl(...args));
        }
    }
});

test('category paths are unique and every navigation category exists', () => {
    const paths = current.seoCategories.map(category => `${category.parentSlug}/${category.categorySlug}`);
    assert.equal(new Set(paths).size, paths.length);
    for (const parent of current.seoParentCategories) {
        for (const child of parent.children) assert.ok(paths.includes(`${parent.slug}/${child.slug}`));
    }
});

test('Product schema implementation and caller remain byte-for-byte unchanged', () => {
    for (const path of ['components/JsonLd.tsx', 'app/[parentSlug]/[categorySlug]/[productSlug]/page.tsx']) {
        const before = execFileSync('git', ['show', `HEAD:${path}`], { encoding: 'utf8' }).replace(/\r\n/g, '\n');
        assert.equal(fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n'), before);
    }
});
