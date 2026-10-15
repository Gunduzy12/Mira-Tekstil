import { Product } from '../types';

const SITE_NAME = 'MiraTekstil';

function toTurkishTitleCase(value: string): string {
    return value
        .split(/[-\s]+/)
        .filter(Boolean)
        .map(word => word.charAt(0).toLocaleUpperCase('tr-TR') + word.slice(1).toLocaleLowerCase('tr-TR'))
        .join(' ');
}

function trimAtWord(value: string, maxLength: number): string {
    const cleanValue = value.replace(/\s+/g, ' ').trim();
    if (cleanValue.length <= maxLength) return cleanValue;

    const shortened = cleanValue.slice(0, maxLength + 1);
    return `${shortened.slice(0, shortened.lastIndexOf(' ')).trim()}…`;
}

export function getProductSearchName(product: Product): string {
    if (product.seoTitle?.trim()) return product.seoTitle.trim();

    if (product.slug?.trim()) {
        const slugWithoutTrailingId = product.slug.replace(/-[a-z0-9]{8,}$/i, '');
        return toTurkishTitleCase(slugWithoutTrailingId);
    }

    return trimAtWord(product.name, 52);
}

export function getProductMetaTitle(product: Product): string {
    return `${trimAtWord(getProductSearchName(product), 52)} | ${SITE_NAME}`;
}

function slugifyTr(value: string): string {
    return value
        .toLocaleLowerCase('tr-TR')
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
}

/**
 * Sayfanın kendi rengini bulur. Bir model birden fazla renk seçeneği taşıyabilir;
 * hangisinin bu sayfanın ürünü olduğunu slug (yoksa ürün adı) içinden anlarız.
 */
export function getProductOwnColor(product: Product): string | undefined {
    const colors = [...new Set((product.variants || [])
        .map(variant => variant.color?.trim())
        .filter((color): color is string => Boolean(color)))];

    if (colors.length === 0) return undefined;
    if (colors.length === 1) return colors[0];

    for (const source of [product.slug, product.name]) {
        if (!source) continue;
        const haystack = `-${slugifyTr(source)}-`;
        let best: { color: string; length: number } | undefined;

        for (const color of colors) {
            const colorSlug = slugifyTr(color);
            if (colorSlug && haystack.includes(`-${colorSlug}-`) && (!best || colorSlug.length > best.length)) {
                best = { color, length: colorSlug.length };
            }
        }
        if (best) return best.color;
    }

    return undefined;
}

export function getProductMetaDescription(product: Product): string {
    if (product.seoDescription?.trim()) return product.seoDescription.trim();

    const searchName = getProductSearchName(product);
    const benefits = [
        product.isCustomSize ? 'ölçünüze özel dikim' : 'farklı ölçü seçenekleri',
        product.variants?.some(variant => variant.color) ? 'renk alternatifleri' : null,
        'güncel fiyat ve ürün detayları',
    ].filter(Boolean);

    return trimAtWord(`${searchName}: ${benefits.join(', ')}. MiraTekstil güvencesiyle ürünü inceleyin.`, 155);
}

