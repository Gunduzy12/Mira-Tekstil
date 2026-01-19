import type { Metadata } from 'next';
import AccountContent from '@/components/AccountContent';

export const metadata: Metadata = {
    title: 'Hesabım | MiraTekstil',
    description: 'Siparişlerinizi ve iade taleplerinizi yönetin.',
};

export default function AccountPage() {
    return <AccountContent />;
}
