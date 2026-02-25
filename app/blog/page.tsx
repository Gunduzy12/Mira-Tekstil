import { Metadata } from 'next';
import Link from 'next/link';
import { blogTopics } from '@/data/seoBlogTopics';

export const metadata: Metadata = {
    title: 'Perde Rehberi & Blog | MiraTekstil',
    description: 'Perde seçimi, ölçü alma, dekorasyon önerileri ve ev tekstili hakkında kapsamlı rehberler. Uzman tavsiyeleri ile doğru perde seçimini yapın.',
    alternates: {
        canonical: '/blog',
    },
    openGraph: {
        title: 'Perde Rehberi & Blog | MiraTekstil',
        description: 'Perde seçimi, ölçü alma, dekorasyon önerileri ve ev tekstili hakkında kapsamlı rehberler.',
        url: 'https://miratekstiltr.com/blog',
        siteName: 'MiraTekstil',
        locale: 'tr_TR',
        type: 'website',
    },
};

export default function BlogIndexPage() {
    return (
        <div className="bg-brand-bg min-h-screen">
            <div className="container mx-auto px-6 py-12">
                <header className="text-center mb-12">
                    <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-4">
                        Perde Rehberi & Blog
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-lg">
                        Perde seçimi, ölçü alma teknikleri ve ev dekorasyon önerileri hakkında
                        kapsamlı rehberlerimizi keşfedin.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {blogTopics.map(topic => (
                        <Link
                            key={topic.slug}
                            href={`/blog/${topic.slug}`}
                            className="group block bg-white rounded-xl border border-brand-border p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                        >
                            <h2 className="text-xl font-serif font-semibold text-brand-primary group-hover:text-brand-secondary transition-colors mb-3">
                                {topic.title.split('|')[0].trim()}
                            </h2>
                            <p className="text-gray-500 text-sm leading-relaxed mb-4">
                                {topic.excerpt}
                            </p>
                            <span className="text-brand-secondary font-medium text-sm group-hover:underline">
                                Devamını Oku →
                            </span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
