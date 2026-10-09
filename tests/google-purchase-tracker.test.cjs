const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');

const compiled = ts.transpileModule(fs.readFileSync('components/GooglePurchaseTracker.tsx', 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 }
}).outputText;

async function harness({ search = '?view=paymentSuccess', storageBlocked = false, gtag = true } = {}) {
    const session = new Map([['pending-google-purchase', JSON.stringify({ transactionId: 'SIP123', value: 999, currency: 'TRY' })]]);
    const local = new Map();
    const calls = [];
    let listener, cleanup, unsubscribed = false;
    const storage = map => ({
        getItem: key => { if (storageBlocked) throw new Error('blocked'); return map.get(key) || null; },
        setItem: (key, value) => map.set(key, value),
        removeItem: key => map.delete(key)
    });
    const exports = {};
    const window = { location: { search }, ...(gtag ? { gtag: (...args) => calls.push(args) } : {}) };
    const sandbox = {
        exports, window, URLSearchParams, sessionStorage: storage(session), localStorage: storage(local),
        setTimeout: () => 1, clearTimeout: () => {},
        require: name => {
            if (name === 'react') return { useEffect: effect => { cleanup = effect(); } };
            if (name === 'firebase/firestore') return { doc: () => 'SIP123', onSnapshot: (_ref, _options, cb) => { listener = cb; return () => { unsubscribed = true; }; } };
            if (name === '../firebaseConfig') return { db: {} };
            throw new Error(name);
        }
    };
    vm.runInNewContext(compiled, sandbox);
    exports.default();
    await new Promise(resolve => setImmediate(resolve));
    return {
        calls, session, local, window,
        emit: (order, metadata = {}) => listener?.({ metadata: { fromCache: false, hasPendingWrites: false, ...metadata }, exists: () => !!order, data: () => order }),
        cleanup: () => cleanup?.(),
        get unsubscribed() { return unsubscribed; }
    };
}

const paid = { isPaid: true, paymentMethod: 'PayTR', paymentDate: '2026-10-09', paymentAmount: '40200' };

test('does not count homepage, blocked storage, pending, failed or incomplete orders', async () => {
    for (const options of [{ search: '' }, { storageBlocked: true }, {}]) {
        const h = await harness(options);
        h.emit(null);
        h.emit({ isPaid: false });
        h.emit({ ...paid, isPaid: false });
        h.emit({ ...paid, paymentAmount: '' });
        h.emit({ ...paid, paymentDate: '' });
        assert.equal(h.calls.length, 0);
    }
});

test('ignores cached/local confirmations then counts confirmed payment exactly once using paid amount', async () => {
    const h = await harness();
    h.emit(paid, { fromCache: true });
    h.emit(paid, { hasPendingWrites: true });
    assert.equal(h.calls.length, 0);
    h.emit(paid);
    h.emit(paid);
    assert.equal(h.calls.length, 1);
    assert.equal(h.calls[0][1], 'purchase');
    assert.equal(h.calls[0][2].value, 402);
    assert.equal(h.calls[0][2].transaction_id, 'SIP123');
    assert.equal(h.session.size, 0);
});

test('queues purchase when gtag has not loaded and unsubscribes on unmount', async () => {
    const h = await harness({ gtag: false });
    h.emit(paid);
    assert.equal(h.window.dataLayer.length, 1);
    assert.equal(h.window.dataLayer[0][1], 'purchase');
    h.cleanup();
    assert.equal(h.unsubscribed, true);
});

test('unmount before confirmation prevents events', async () => {
    const h = await harness();
    h.cleanup();
    h.emit(paid);
    assert.equal(h.calls.length, 0);
});
