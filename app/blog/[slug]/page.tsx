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
            url: `https://www.miratekstiltr.com/blog/${topic.slug}`,
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
                    {/* Estetik Banner (CTR ve Dwell Time Artırıcı) */}
                    <div className="relative w-full h-64 md:h-72 rounded-2xl overflow-hidden mb-8 bg-cover bg-center flex flex-col justify-center items-center text-center p-6 shadow-lg border border-brand-border/60" style={{ backgroundImage: "url('/perde_hava_durumu_banner.png')" }}>
                        <div className="absolute inset-0 bg-black/40"></div>
                        <div className="relative z-10 space-y-3">
                            <span className="inline-block text-[10px] font-bold uppercase tracking-widest text-brand-secondary bg-white/95 px-3 py-1 rounded-full shadow-sm">
                                MİRATEKSTİL BLOG REHBERİ
                            </span>
                            <h2 className="text-xl md:text-3xl font-serif font-bold text-white max-w-2xl drop-shadow-md leading-tight">
                                {topic.title.split('|')[0].trim()}
                            </h2>
                            <p className="text-xs md:text-sm text-gray-200 max-w-lg font-light line-clamp-2">
                                {topic.excerpt}
                            </p>
                        </div>
                    </div>

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
