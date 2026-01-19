import type { Metadata } from 'next';
import RegisterForm from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
    title: 'Hesap Oluştur | MiraTekstil',
    description: 'Yeni bir MiraTekstil hesabı oluşturun ve avantajlardan yararlanın.',
};

export default function RegisterPage() {
    return <RegisterForm />;
}
