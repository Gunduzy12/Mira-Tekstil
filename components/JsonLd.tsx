import React from 'react';
import { calculateShippingCost } from '../utils/commerce';

interface JsonLdProps {
    data: Record<string, unknown>;
}

const JsonLd: React.FC<JsonLdProps> = ({ data }) => {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
};

export default JsonLd;

// =============================================
// SCHEMA GENERATORS
// =============================================

const BASE_URL = 'https://www.miratekstiltr.com';

function normalizeMerchantSku(value: string): string {
    return value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^A-Za-z0-9._-]+/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
        .slice(0, 70);
}

function getSchemaImages(imageUrl: string | string[]): string[] {
    const urls = (Array.isArray(imageUrl) ? imageUrl : [imageUrl])
        .filter((url): url is string => typeof url === 'string' && /^https?:\/\//i.test(url.trim()))
        .map(url => url.trim());

    return urls.length > 0 ? [...new Set(urls)] : [`${BASE_URL}/perde_hava_durumu_banner.png`];
}

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'MiraTekstil',
        url: BASE_URL,
        logo: `${BASE_URL}/favicon.ico`,
        sameAs: [
            'https://www.instagram.com/barisyilmaz4139/',
            'https://www.trendyol.com/sr?mid=750999&os=1'
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+905374009410',
            contactType: 'customer service',
            availableLanguage: 'Turkish'
        },
        hasMerchantReturnPolicy: {
            '@type': 'MerchantReturnPolicy',
            applicableCountry: 'TR',
            returnPolicyCountry: 'TR',
            merchantReturnLink: `${BASE_URL}/iade-ve-geri-odeme`,
            returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
            merchantReturnDays: 14,
            returnMethod: 'https://schema.org/ReturnByMail',
            returnFees: 'https://schema.org/FreeReturn'
        }
    };
}

export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MiraTekstil',
        url: BASE_URL
    };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`
        }))
    };
}

export function generateCollectionPageSchema(
    name: string,
    description: string,
    url: string,
    productCount: number
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name,
        description,
        url: `${BASE_URL}${url}`,
        numberOfItems: productCount,
        provider: {
            '@type': 'Organization',
            name: 'MiraTekstil',
            url: BASE_URL
        }
    };
}

export function generateItemListSchema(items: { name: string; url: string; imageUrl?: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        numberOfItems: items.length,
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            url: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
            name: item.name,
            ...(item.imageUrl ? { image: item.imageUrl } : {}),
        })),
    };
}

export function generateBlogPostingSchema(article: {
    headline: string;
    description: string;
    url: string;
}) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: article.headline,
        description: article.description,
        mainEntityOfPage: `${BASE_URL}${article.url}`,
        image: `${BASE_URL}/perde_hava_durumu_banner.png`,
        author: {
            '@type': 'Organization',
            name: 'MiraTekstil',
            url: BASE_URL,
        },
        publisher: {
            '@type': 'Organization',
            name: 'MiraTekstil',
            url: BASE_URL,
            logo: {
                '@type': 'ImageObject',
                url: `${BASE_URL}/favicon.ico`,
            },
        },
    };
}

export function generateProductSchema(product: {
    name: string;
    description: string;
    imageUrl: string | string[];
    price: number;
    originalPrice?: number;
    brand: string;
    url: string;
    inStock: boolean;
    rating?: number;
    reviewCount?: number;
    category?: string;
    sku?: string;
    productId?: string;
    color?: string | string[];
    material?: string;
    reviews?: { author: string; rating: number; comment: string; date: string }[];
}) {
    const fallbackSku = `MIRA-${product.productId || product.name}`;
    const sku = normalizeMerchantSku(product.sku || fallbackSku) || 'MIRA-PRODUCT';

    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: getSchemaImages(product.imageUrl),
        category: product.category || 'Perde',
        sku,
        brand: {
            '@type': 'Brand',
            name: product.brand || 'MiraTekstil'
        },
        offers: {
            '@type': 'Offer',
            url: `${BASE_URL}${product.url}`,
            itemCondition: 'https://schema.org/NewCondition',
            priceCurrency: 'TRY',
            price: (product.price || 0).toFixed(2),
            validFrom: new Date().toISOString(),
            priceValidUntil: new Date(new Date().getFullYear() + 1, 11, 31).toISOString().split('T')[0],
            availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'MiraTekstil'
            },
            hasMerchantReturnPolicy: {
                '@type': 'MerchantReturnPolicy',
                applicableCountry: 'TR',
                returnPolicyCountry: 'TR',
                merchantReturnLink: `${BASE_URL}/iade-ve-geri-odeme`,
                returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
                merchantReturnDays: 14,
                returnMethod: 'https://schema.org/ReturnByMail',
                returnFees: 'https://schema.org/FreeReturn'
            },
            shippingDetails: {
                '@type': 'OfferShippingDetails',
                shippingDestination: {
                    '@type': 'DefinedRegion',
                    addressCountry: 'TR'
                },
                shippingRate: {
                    '@type': 'MonetaryAmount',
                    value: calculateShippingCost(product.price || 0).toFixed(2),
                    currency: 'TRY'
                },
                deliveryTime: {
                    '@type': 'ShippingDeliveryTime',
                    handlingTime: {
                        '@type': 'QuantitativeValue',
                        minValue: 1,
                        maxValue: 2,
                        unitCode: 'DAY'
                    },
                    transitTime: {
                        '@type': 'QuantitativeValue',
                        minValue: 1,
                        maxValue: 3,
                        unitCode: 'DAY'
                    }
                }
            }
        }
    };

    if (product.color && (Array.isArray(product.color) ? product.color.length > 0 : product.color.trim())) {
        schema.color = product.color;
    }

    if (product.material?.trim()) {
        schema.material = product.material;
    }

    if (product.rating && product.reviewCount && product.reviewCount > 0) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: (product.rating ? Number(product.rating) : 5).toFixed(1),
            reviewCount: product.reviewCount
        };
    }

    if (product.reviews && product.reviews.length > 0) {
        schema.review = product.reviews.map(r => ({
            '@type': 'Review',
            author: {
                '@type': 'Person',
                name: r.author
            },
            datePublished: r.date,
            reviewBody: r.comment,
            reviewRating: {
                '@type': 'Rating',
                ratingValue: r.rating
            }
        }));
    }

    return schema;
}

export function generateFAQSchema(faqItems: { question: string; answer: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqItems.map(item => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer
            }
        }))
    };
}
