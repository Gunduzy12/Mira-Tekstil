"use client";

import React, { useState } from 'react';
import { useNotification } from '../context/NotificationContext';
import { sendFormToEmail } from '../services/emailService';

const ContactForm: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { showNotification } = useNotification();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // emailService.ts içinde tanımlanan 'İletişim Formu' senaryosunu tetikler
            const success = await sendFormToEmail('İletişim Formu', formData);

            if (success) {
                showNotification('Mesajınız başarıyla gönderildi. Müşteri temsilcimiz en kısa sürede size dönüş yapacaktır.', 'success');
                setFormData({ name: '', email: '', subject: '', message: '' });
            } else {
                showNotification('Mesaj gönderilirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.', 'error');
            }
        } catch (error) {
            showNotification('Bir hata oluştu.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClasses = "w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary transition-all shadow-sm";

    return (
        <div className="bg-brand-bg">
            <header className="bg-brand-light py-16 text-center">
                <h1 className="text-4xl md:text-5xl font-serif font-bold text-brand-primary mb-4">İletişim & Destek</h1>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">MiraTekstil ürünleri, siparişleriniz ve kurumsal işbirlikleri için bize ulaşın.</p>
            </header>

            <div className="container mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    {/* Contact Info */}
                    <section aria-labelledby="contact-info-title">
                        <h2 id="contact-info-title" className="text-2xl font-serif font-bold text-brand-primary mb-6">İletişim Bilgileri</h2>
                        <p className="text-gray-600 mb-8 leading-relaxed">
                            Müşteri memnuniyeti odaklı ekibimiz, sorularınızı yanıtlamak için hafta içi 09:00 - 18:00 saatleri arasında hizmet vermektedir.
                        </p>

                        <address className="space-y-8 not-italic">
                            <div className="flex items-start space-x-4">
                                <div className="bg-brand-secondary/10 p-3 rounded-full text-brand-secondary flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-brand-primary text-lg">Merkez Ofis & Depo</h3>
                                    <p className="text-gray-500 mt-1 uppercase">
                                        KURTDERESİ MAH. BERRAK SOK. NO: 8 / 1C<br />
                                        31520 Cumhuriyet, Samandağ / Hatay<br />
                                        TÜRKİYE
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-brand-secondary/10 p-3 rounded-full text-brand-secondary flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-brand-primary text-lg">Telefon & WhatsApp</h3>
                                    <p className="text-gray-500 mt-1">
                                        <a href="tel:+905374009410" className="hover:text-brand-secondary transition-colors font-medium">0537 400 94 10</a>
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Hafta içi: 09:00 - 18:00</p>
                                </div>
                            </div>

                            <div className="flex items-start space-x-4">
                                <div className="bg-brand-secondary/10 p-3 rounded-full text-brand-secondary flex-shrink-0">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-brand-primary text-lg">E-posta</h3>
                                    <p className="text-gray-500 mt-1">
                                        <a href="mailto:yilmazbaris814@gmail.com" className="hover:text-brand-secondary transition-colors">yilmazbaris814@gmail.com</a>
                                    </p>
                                </div>
                            </div>
                        </address>
                    </section>

                    {/* Contact Form */}
                    <section aria-labelledby="contact-form-title" className="bg-white p-8 rounded-xl border border-brand-border shadow-lg">
                        <h2 id="contact-form-title" className="text-2xl font-serif font-bold text-brand-primary mb-6">Bize Mesaj Gönderin</h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Adınız Soyadınız</label>
                                <input
                                    type="text" id="name" name="name"
                                    value={formData.name} onChange={handleChange} required
                                    className={inputClasses}
                                    placeholder="Adınız Soyadınız"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">E-posta Adresiniz</label>
                                <input
                                    type="email" id="email" name="email"
                                    value={formData.email} onChange={handleChange} required
                                    className={inputClasses}
                                    placeholder="ornek@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Konu</label>
                                <select
                                    id="subject" name="subject"
                                    value={formData.subject} onChange={handleChange} required
                                    className={inputClasses}
                                >
                                    <option value="">Konu Seçiniz...</option>
                                    <option value="siparis">Sipariş Durumu Sorgulama</option>
                                    <option value="iade">İade ve Değişim Talebi</option>
                                    <option value="urun">Ürün Bilgisi ve Stok</option>
                                    <option value="toptan">Toptan Satış / İşbirliği</option>
                                    <option value="diger">Diğer</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Mesajınız</label>
                                <textarea
                                    id="message" name="message" rows={5}
                                    value={formData.message} onChange={handleChange} required
                                    className={inputClasses}
                                    placeholder="Mesajınızı buraya yazınız..."
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-brand-primary text-white py-4 rounded-lg hover:bg-brand-dark transition-colors font-semibold text-lg disabled:opacity-70 shadow-md hover:shadow-lg"
                            >
                                {isSubmitting ? 'Gönderiliyor...' : 'Mesajı Gönder'}
                            </button>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default ContactForm;
