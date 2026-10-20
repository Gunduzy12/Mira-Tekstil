/* eslint-disable @typescript-eslint/no-require-imports -- Node's CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const loaded = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('utils/commerce.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, { exports: loaded, require: () => ({}) });

test('coupon is valid through the end of its expiration day', () => {
    assert.equal(loaded.isCouponExpired('2026-11-19', new Date(2026, 10, 19, 23, 30)), false);
    assert.equal(loaded.isCouponExpired('2026-11-19', new Date(2026, 10, 20, 0, 1)), true);
});

test('coupon without a valid expiration date does not expire', () => {
    assert.equal(loaded.isCouponExpired('', new Date(2030, 0, 1)), false);
    assert.equal(loaded.isCouponExpired(undefined, new Date(2030, 0, 1)), false);
    assert.equal(loaded.isCouponExpired('bozuk-tarih', new Date(2030, 0, 1)), false);
});
