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

export function getProductMetaDescription(product: Product): string {
    const searchName = getProductSearchName(product);
    const benefits = [
        product.isCustomSize ? 'ölçünüze özel dikim' : 'farklı ölçü seçenekleri',
        product.variants?.some(variant => variant.color) ? 'renk alternatifleri' : null,
        'güncel fiyat ve ürün detayları',
    ].filter(Boolean);

    return trimAtWord(`${searchName}: ${benefits.join(', ')}. MiraTekstil güvencesiyle ürünü inceleyin.`, 155);
}

