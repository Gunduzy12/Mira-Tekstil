import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { blogTopics, findBlogTopic } from '@/data/seoBlogTopics';
import Breadcrumbs from '@/components/Breadcrumbs';
import CategorySEOContent from '@/components/CategorySEOContent';
import Link from 'next/link';

type Props = {
    params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const topic = findBlogTopic(slug);

    if (!topic) {
        return { title: 'Yazı Bulunamadı | MiraTekstil Blog' };
    }

    return {
        title: topic.title,
        description: topic.metaDescription,
        alternates: {
            canonical: `/blog/${topic.slug}`,
        },
        openGraph: {
            title: topic.title,
            description: topic.metaDescription,
            url: `https://miratekstiltr.com/blog/${topic.slug}`,
            siteName: 'MiraTekstil',
            locale: 'tr_TR',
            type: 'article',
        },
    };
}

export function generateStaticParams() {
    return blogTopics.map(t => ({ slug: t.slug }));
}

export default async function BlogArticlePage({ params }: Props) {
    const { slug } = await params;
    const topic = findBlogTopic(slug);

    if (!topic) {
        notFound();
    }

    return (
        <div className="bg-brand-bg min-h-screen">
            <div className="container mx-auto px-6 py-8 max-w-3xl">
                <Breadcrumbs
                    items={[
                        { name: 'Blog', href: '/blog' },
                        { name: topic.title.split('|')[0].trim(), href: `/blog/${topic.slug}` },
                    ]}
                />

                <article>
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-6 leading-tight">
                        {topic.title.split('|')[0].trim()}
                    </h1>

                    <CategorySEOContent seoBlocks={topic.content} />
                </article>

                {/* İlgili Yazılar */}
                <div className="mt-16 border-t border-brand-border pt-10">
                    <h2 className="text-xl font-serif text-brand-primary mb-6">Diğer Rehberler</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {blogTopics
                            .filter(t => t.slug !== slug)
                            .slice(0, 4)
                            .map(t => (
                                <Link
                                    key={t.slug}
                                    href={`/blog/${t.slug}`}
                                    className="block p-4 bg-white rounded-lg border border-brand-border hover:shadow-md transition-shadow"
                                >
                                    <h3 className="font-medium text-brand-primary hover:text-brand-secondary transition-colors text-sm">
                                        {t.title.split('|')[0].trim()}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{t.excerpt}</p>
                                </Link>
                            ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
