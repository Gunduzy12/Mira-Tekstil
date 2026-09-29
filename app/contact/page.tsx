import type { Metadata } from 'next';
import ContactForm from '@/components/ContactForm';

export const metadata: Metadata = {
    title: 'İletişim | MiraTekstil',
    description: 'MiraTekstil ile iletişime geçin. Siparişleriniz, ürünlerimiz veya işbirlikleri için bize ulaşın.',
    alternates: {
        canonical: '/contact',
    },
};

export default function ContactPage() {
    return <ContactForm />;
}
