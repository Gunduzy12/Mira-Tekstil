import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findSEOParent, seoParentCategories } from '@/data/seoCategories';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategorySEOContent from '@/components/CategorySEOContent';
import JsonLd, { generateCollectionPageSchema } from '@/components/JsonLd';

export const revalidate = 3600;

type Props = {
    params: Promise<{ parentSlug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { parentSlug } = await params;
    const parent = findSEOParent(parentSlug);

    if (!parent) {
        return { title: 'Sayfa Bulunamadı | MiraTekstil' };
    }

    return {
        title: parent.title,
        description: parent.metaDescription,
        alternates: {
            canonical: `/${parent.slug}`,
        },
        openGraph: {
            title: parent.title,
            description: parent.metaDescription,
            url: `https://miratekstiltr.com/${parent.slug}`,
            siteName: 'MiraTekstil',
            locale: 'tr_TR',
            type: 'website',
        },
    };
}

export function generateStaticParams() {
    return seoParentCategories.map(p => ({
        parentSlug: p.slug,
    }));
}

export default async function ParentCategoryPage({ params }: Props) {
    const { parentSlug } = await params;
    const parent = findSEOParent(parentSlug);

    if (!parent) {
        notFound();
    }

    return (
        <div className="bg-brand-bg min-h-screen">
            <JsonLd
                data={generateCollectionPageSchema(
                    parent.name,
                    parent.metaDescription,
                    `/${parent.slug}`,
                    parent.children.length
                )}
            />

            <div className="container mx-auto px-6 py-8">
                <Breadcrumbs items={[{ name: parent.name, href: `/${parent.slug}` }]} />

                <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-8">
                    {parent.h1}
                </h1>

                {/* Alt Kategori Kartları */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                    {parent.children.map(child => (
                        <Link
                            key={child.slug}
                            href={`/${parent.slug}/${child.slug}`}
                            className="group block bg-white rounded-xl border border-brand-border overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <div className="p-8 text-center">
                                <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-light flex items-center justify-center group-hover:bg-brand-secondary/10 transition-colors">
                                    <svg className="w-10 h-10 text-brand-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                                <h2 className="text-xl font-serif font-semibold text-brand-primary group-hover:text-brand-secondary transition-colors mb-2">
                                    {child.name}
                                </h2>
                                <p className="text-gray-500 text-sm">{child.description}</p>
                                <span className="inline-block mt-4 text-brand-secondary font-medium text-sm group-hover:underline">
                                    Koleksiyonu İncele →
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* SEO İçerik */}
                <CategorySEOContent seoBlocks={parent.seoBlocks} />
            </div>
        </div>
    );
}
