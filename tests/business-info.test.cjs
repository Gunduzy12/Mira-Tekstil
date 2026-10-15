/* eslint-disable @typescript-eslint/no-require-imports -- Node's CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const source = fs.readFileSync('data/businessInfo.ts', 'utf8');
const loaded = {};
vm.runInNewContext(ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, { exports: loaded });

test('tax id is a 10-digit vergi kimlik no and the seller line shows it', () => {
    assert.match(loaded.BUSINESS_INFO.taxId, /^\d{10}$/);
    assert.ok(loaded.getSellerLine().includes(loaded.BUSINESS_INFO.taxId));
});

test('public business info file never contains an 11-digit personal ID number', () => {
    assert.ok(!/\b\d{11}\b/.test(source), 'an 11-digit number (possible TC kimlik no) is present in businessInfo.ts');
});

test('only business identity fields are exposed', () => {
    const allowed = ['brandName', 'sellerName', 'businessType', 'taxOffice', 'taxId', 'streetAddress', 'district', 'province', 'postalCode', 'country'];
    assert.deepEqual(Object.keys(loaded.BUSINESS_INFO).sort(), allowed.sort());
});
