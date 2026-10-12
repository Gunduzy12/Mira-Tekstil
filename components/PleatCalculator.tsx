'use client';

import { useState } from 'react';

export default function PleatCalculator() {
    const [width, setWidth] = useState('200');
    const [factor, setFactor] = useState('3');
    const numericWidth = Number(width);
    const valid = width.trim() !== '' && Number.isFinite(numericWidth) && numericWidth > 0 && numericWidth <= 10000;
    const fabricWidth = numericWidth * Number(factor);

    return (
        <section className="my-8 rounded-xl border border-brand-border bg-white p-6" aria-labelledby="pleat-calculator-title">
            <h2 id="pleat-calculator-title" className="text-xl font-serif text-brand-primary mb-4">Yaklaşık Pile Hesaplayıcı</h2>
            <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium">Bitmiş perde eni (cm)
                    <input type="number" min="1" max="10000" step="any" value={width} onChange={event => setWidth(event.target.value)} className="mt-2 block w-full rounded border border-gray-300 p-3" />
                </label>
                <label className="text-sm font-medium">Pile katsayısı
                    <select value={factor} onChange={event => setFactor(event.target.value)} className="mt-2 block w-full rounded border border-gray-300 p-3">
                        <option value="2">1/2 — 2 kat</option>
                        <option value="2.5">1/2,5 — 2,5 kat</option>
                        <option value="3">1/3 — 3 kat</option>
                    </select>
                </label>
            </div>
            <p aria-live="polite" className="mt-4 font-semibold text-brand-primary">{valid ? `Yaklaşık kumaş eni: ${fabricWidth.toLocaleString('tr-TR', { maximumFractionDigits: 1 })} cm` : '1–10.000 cm arasında geçerli bir en girin.'}</p>
            <p className="mt-3 text-sm text-gray-600">Bu sonuç eğitim amaçlıdır; dikiş payı içermez, fiyat veya sipariş ölçüsü değildir. Ürün sayfasında bitmiş en mi kumaş eni mi istendiğini siparişten önce teyit edin.</p>
        </section>
    );
}
