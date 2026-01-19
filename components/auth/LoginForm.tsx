"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

const LoginForm: React.FC = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [localError, setLocalError] = useState('');
    const { login, isLoading, user } = useAuth();

    useEffect(() => {
        if (user) {
            router.push('/');
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLocalError('');
        await login(email, password);
    };

    const inputClass = "appearance-none relative block w-full px-3 py-3 bg-white border border-gray-300 placeholder-gray-500 text-black focus:outline-none focus:ring-brand-secondary focus:border-brand-secondary focus:z-10 sm:text-sm font-medium";

    return (
        <div className="flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-brand-bg min-h-[60vh]">
            <div className="max-w-md w-full space-y-8 bg-white p-10 shadow-lg border border-gray-200 rounded-lg">
                <div>
                    <h1 className="mt-6 text-center text-3xl font-serif font-extrabold text-brand-primary">
                        Giriş Yap
                    </h1>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Veya{' '}
                        <Link href="/auth/register" className="font-medium text-brand-secondary hover:text-brand-dark transition-colors">
                            yeni bir hesap oluşturun
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <input type="hidden" name="remember" defaultValue="true" />
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email-address" className="sr-only">E-posta Adresi</label>
                            <input
                                id="email-address"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`${inputClass} rounded-t-md`}
                                placeholder="E-posta Adresi"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Şifre</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={`${inputClass} rounded-b-md`}
                                placeholder="Şifre"
                            />
                        </div>
                    </div>

                    {localError && <p className="text-sm text-red-600">{localError}</p>}

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <a href="#" className="font-medium text-brand-secondary hover:text-brand-dark transition-colors">
                                Şifrenizi mi unuttunuz?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-brand-secondary hover:bg-brand-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-secondary disabled:opacity-50 transition-colors shadow-sm hover:shadow-md"
                        >
                            {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
