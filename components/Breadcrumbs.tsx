import React from 'react';
import Link from 'next/link';
import JsonLd, { generateBreadcrumbSchema } from './JsonLd';

interface BreadcrumbItem {
    name: string;
    href: string;
}

interface BreadcrumbsProps {
    items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
    const allItems = [{ name: 'Anasayfa', href: '/' }, ...items];

    const schemaItems = allItems.map(item => ({
        name: item.name,
        url: item.href
    }));

    return (
        <>
            <JsonLd data={generateBreadcrumbSchema(schemaItems)} />
            <nav aria-label="Breadcrumb" className="py-4">
                <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
                    {allItems.map((item, index) => (
                        <li key={item.href} className="flex items-center">
                            {index > 0 && (
                                <svg className="w-4 h-4 mx-1 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            )}
                            {index === allItems.length - 1 ? (
                                <span className="text-brand-primary font-medium">{item.name}</span>
                            ) : (
                                <Link
                                    href={item.href}
                                    className="hover:text-brand-secondary transition-colors"
                                    title={item.name}
                                >
                                    {item.name}
                                </Link>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </>
    );
};

export default Breadcrumbs;
