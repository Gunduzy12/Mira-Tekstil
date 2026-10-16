/* eslint-disable @typescript-eslint/no-require-imports -- Node CommonJS test harness. */
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const { execFileSync } = require('node:child_process');
const exportsObject = {};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('utils/orderShipping.ts', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText, { exports: exportsObject });

test('shipping is 100 TL through 700 TL and free strictly above 700 TL', () => {
    for (const subtotal of [0.01, 402, 699.99, 700]) assert.equal(exportsObject.calculateOrderShippingCost(subtotal), 100);
    for (const subtotal of [700.01, 800, 1400]) assert.equal(exportsObject.calculateOrderShippingCost(subtotal), 0);
});

test('empty or invalid totals do not incur shipping', () => {
    for (const subtotal of [0, -10, NaN, Infinity]) assert.equal(exportsObject.calculateOrderShippingCost(subtotal), 0);
});

test('coupon-adjusted subtotal determines shipping and amount sent to checkout', () => {
    const subtotal = 800 - 150;
    const shipping = exportsObject.calculateOrderShippingCost(subtotal);
    assert.equal(shipping, 100);
    assert.equal(Math.round((subtotal + shipping) * 100), 75000);
    const checkout = fs.readFileSync('components/CheckoutContent.tsx', 'utf8');
    assert.match(checkout, /calculateOrderShippingCost\(subTotalAfterDiscount\)/);
    assert.match(checkout, /paymentAmount: Math\.round\(total \* 100\)/);
    assert.match(checkout, /paytrBasketItems\.push\(\["Kargo Ücreti", shippingCost\.toFixed\(2\), "1"\]\)/);
});

test('Product schema implementation and PayTR integration are unchanged', () => {
    for (const path of ['components/JsonLd.tsx', 'services/paytrService.ts', 'app/api/paytr/get-token/route.ts', 'app/api/paytr/callback/route.ts']) {
        const original = execFileSync('git', ['show', `HEAD:${path}`], { encoding: 'utf8' });
        assert.equal(fs.readFileSync(path, 'utf8').replace(/\r\n/g, '\n'), original.replace(/\r\n/g, '\n'));
    }
});

test('Product schema shipping helper delegates to the same order policy', () => {
    const commerceExports = {};
    vm.runInNewContext(ts.transpileModule(fs.readFileSync('utils/commerce.ts', 'utf8'), {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
    }).outputText, { exports: commerceExports, require: name => {
        assert.equal(name, './orderShipping');
        return exportsObject;
    } });
    for (const amount of [228, 402, 603, 700, 700.01, 800]) {
        assert.equal(commerceExports.calculateShippingCost(amount), exportsObject.calculateOrderShippingCost(amount));
    }
});
