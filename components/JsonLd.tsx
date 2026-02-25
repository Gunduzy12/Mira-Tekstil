import React from 'react';

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

const BASE_URL = 'https://miratekstiltr.com';

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
        }
    };
}

export function generateWebSiteSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MiraTekstil',
        url: BASE_URL,
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${BASE_URL}/shop?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
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

export function generateProductSchema(product: {
    name: string;
    description: string;
    imageUrl: string;
    price: number;
    originalPrice?: number;
    brand: string;
    url: string;
    inStock: boolean;
    rating?: number;
    reviewCount?: number;
    category?: string;
}) {
    const schema: Record<string, unknown> = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        description: product.description,
        image: product.imageUrl,
        category: product.category || 'Perde',
        brand: {
            '@type': 'Brand',
            name: product.brand || 'MiraTekstil'
        },
        offers: {
            '@type': 'Offer',
            url: `${BASE_URL}${product.url}`,
            priceCurrency: 'TRY',
            price: product.price.toFixed(2),
            availability: product.inStock
                ? 'https://schema.org/InStock'
                : 'https://schema.org/OutOfStock',
            seller: {
                '@type': 'Organization',
                name: 'MiraTekstil'
            }
        }
    };

    if (product.rating && product.reviewCount && product.reviewCount > 0) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: product.rating.toFixed(1),
            reviewCount: product.reviewCount
        };
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
