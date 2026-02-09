"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from './Icons';
import { sendFormToEmail } from '../services/emailService';
import { useNotification } from '../context/NotificationContext';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { showNotification } = useNotification();

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsSubmitting(true);
    try {
      const success = await sendFormToEmail('Bülten Aboneliği', { email });
      if (success) {
        showNotification('Bültenimize başarıyla abone oldunuz!', 'success');
        setEmail('');
      } else {
        showNotification('Bir hata oluştu.', 'error');
      }
    } catch {
      showNotification('Bir hata oluştu.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-brand-primary text-brand-light mt-auto">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-1">
            <h3 className="text-2xl font-serif font-semibold mb-4">MiraTekstil</h3>
            <p className="text-gray-400 text-sm mb-6">Konfor ve stil dolu bir yaşam için en kaliteli tekstil ürünlerini keşfedin.</p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/barisyilmaz4139/" target="_blank" rel="nofollow noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Instagram" title="Instagram Sayfamız"><InstagramIcon className="h-6 w-6" /></a>
              <a href="https://www.facebook.com/bar.s.y.lmaz.880467?rdid=qXhECL7kkohPYets&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F17n2k2Q54W%2F#" target="_blank" rel="nofollow noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="Facebook" title="Facebook Sayfamız"><FacebookIcon className="h-6 w-6" /></a>
              <a href="https://wa.me/905374009410" target="_blank" rel="nofollow noreferrer" className="text-gray-400 hover:text-white transition-colors" aria-label="WhatsApp" title="WhatsApp İle İletişime Geçin"><WhatsAppIcon className="h-6 w-6" /></a>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4 tracking-wider uppercase text-gray-300">Mağaza</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/shop" className="hover:text-white transition-colors" title="Aksesuarlar Koleksiyonu">Aksesuarlar</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors" title="Yatak Odası Tekstili">Yatak Odası</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors" title="Banyo Tekstili">Banyo</Link></li>
              <li><Link href="/shop" className="hover:text-white transition-colors" title="Oturma Odası Tekstili">Oturma Odası</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 tracking-wider uppercase text-gray-300">Hakkımızda</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><Link href="/about" className="hover:text-white transition-colors" title="Hikayemiz">Hikayemiz</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors" title="İletişim Sayfası">İletişim</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors" title="Sıkça Sorulan Sorular">S.S.S.</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 tracking-wider uppercase text-gray-300">Bülten</h4>
            <p className="text-sm text-gray-400 mb-4">Özel güncellemeler için bültenimize kaydolun.</p>
            <form onSubmit={handleNewsletterSubmit} className="flex">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-posta Adresiniz"
                required
                className="bg-brand-dark text-white placeholder-gray-500 px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-brand-secondary rounded-l-md border-0"
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-brand-secondary text-white px-4 py-2 hover:bg-brand-secondary/80 transition-colors rounded-r-md disabled:opacity-50"
                title="Bültene Katıl"
              >
                {isSubmitting ? '...' : 'Katıl'}
              </button>
            </form>
          </div>
        </div>
        <div className="mt-16 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <p>&copy; 2025 Yusuf Gündüz Developer. Tüm hakları saklıdır.</p>
            <span className="hidden sm:inline text-gray-600">|</span>
            <Link href="/admin" className="hover:text-white transition-colors" title="Yönetici Paneli Girişi" rel="nofollow">Yönetici Paneli</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
