"use client";

import React, { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartIcon, UserIcon, MenuIcon, CloseIcon, HeartIcon, SearchIcon, TruckIcon } from './Icons';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import CartSidebar from './CartSidebar';

interface HeaderProps {

  onSearch?: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const navLinks = [
    { name: 'Sipariş Takip', path: '/order-tracking' },
    { name: 'Blog', path: '/blog' },
    { name: 'Hakkımızda', path: '/about' },
    { name: 'İletişim', path: '/contact' },
  ];

  const megaMenuCategories = [
    {
      name: 'Perde',
      path: '/perde',
      children: [
        { name: 'Blackout Perde', path: '/perde/blackout-perde' },
        { name: 'Saten Perde', path: '/perde/saten-perde' },
        { name: 'Tül Perde', path: '/perde/tul-perde' },
        { name: 'Özel Ölçü Perde', path: '/perde/ozel-olcu-perde' },
      ],
    },
    {
      name: 'Ev Tekstili',
      path: '/ev-tekstili',
      children: [
        { name: 'Yastık Kılıfı', path: '/ev-tekstili/yastik-kilifi' },
      ],
    },
  ];

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      if (onSearch) onSearch(searchQuery.trim());
      setIsMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-brand-bg/95 backdrop-blur-md shadow-sm transition-all">
        <div className="bg-brand-primary text-white text-center py-2 text-xs font-medium tracking-wide">
          TÜRKİYE'NİN HER YERİNE 500 TL VE ÜZERİ KARGO BEDAVA
        </div>
        <div className="container mx-auto px-6 flex justify-between items-center h-20 border-b border-brand-border">
          <div className="flex items-center">
            <button
              className="lg:hidden mr-4 text-brand-primary hover:text-brand-secondary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Menüyü aç/kapat"
            >
              <MenuIcon className="h-7 w-7" />
            </button>
            <Link
              href="/"
              className="text-3xl font-serif font-bold text-brand-primary tracking-wider hover:opacity-80 transition-opacity"
              aria-label="MiraTekstil Anasayfa"
              title="MiraTekstil Anasayfa"
            >
              MiraTekstil
            </Link>
          </div>

          <nav className="hidden lg:flex items-center space-x-6" role="navigation">
            {/* Mega Menu Categories */}
            {megaMenuCategories.map((cat) => (
              <div key={cat.name} className="relative group h-full flex items-center">
                <Link
                  href={cat.path}
                  className="text-brand-primary hover:text-brand-secondary transition duration-300 font-semibold text-sm uppercase tracking-wide py-2 border-b-2 border-transparent group-hover:border-brand-secondary"
                  title={cat.name}
                >
                  {cat.name}
                </Link>
                <div className="absolute top-full left-0 pt-2 w-56 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="bg-white rounded-lg shadow-xl border border-brand-border py-2">
                    <Link
                      href={cat.path}
                      className="block px-4 py-2 text-sm font-semibold text-brand-primary hover:bg-gray-50 hover:text-brand-secondary border-b border-gray-100"
                      title={`Tüm ${cat.name}`}
                    >
                      Tüm {cat.name}
                    </Link>
                    {cat.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.path}
                        className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-secondary transition-colors"
                        title={child.name}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ))}
            {/* Regular Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className="text-brand-primary hover:text-brand-secondary transition duration-300 font-medium text-sm uppercase tracking-wide py-2 border-b-2 border-transparent hover:border-brand-secondary"
                title={link.name}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://www.trendyol.com/sr?mid=750999&os=1"
              target="_blank"
              rel="nofollow noreferrer"
              className="text-orange-600 hover:text-orange-700 transition duration-300 font-bold text-sm uppercase tracking-wide py-2 border-b-2 border-transparent hover:border-orange-500"
              title="Trendyol Mağazamızı Ziyaret Edin"
            >
              Trendyol Mağaza
            </a>
          </nav>

          <div className="flex items-center space-x-4">
            <form onSubmit={handleSearchSubmit} className="relative hidden md:block group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ürün ara..."
                className="bg-brand-light border border-transparent border-b-brand-border rounded-full py-2 pl-4 pr-10 w-48 text-sm focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:w-64 transition-all duration-300"
                aria-label="Ürün arama"
              />
              <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-brand-secondary transition-colors" aria-label="Ara" title="Ara">
                <SearchIcon className="h-5 w-5" />
              </button>
            </form>

            <div className="flex items-center space-x-2 border-l border-gray-200 pl-4 ml-2">
              {user ? (
                <div className="relative group h-10 flex items-center">
                  <Link
                    href="/account"
                    className="flex items-center text-brand-primary hover:text-brand-secondary transition duration-300 p-1"
                    aria-label="Kullanıcı hesabı"
                    title="Hesabım"
                  >
                    <UserIcon className="h-6 w-6" />
                  </Link>
                  <div className="absolute top-full right-0 pt-2 w-48 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right">
                    <div className="bg-white rounded-md shadow-xl py-1 border border-brand-border">
                      <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                        <p className="text-xs text-gray-500">Hoşgeldiniz,</p>
                        <p className="text-sm font-semibold text-brand-primary truncate">{user.name}</p>
                      </div>
                      <Link href="/account" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-secondary" title="Hesabım">Hesabım</Link>
                      <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50" title="Çıkış Yap">Çıkış Yap</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="hidden lg:flex items-center space-x-3">
                  <Link href="/auth/login" className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors" title="Giriş Yap">Giriş</Link>
                  <span className="text-gray-300">|</span>
                  <Link href="/auth/register" className="text-sm font-medium text-brand-primary hover:text-brand-secondary transition-colors" title="Kayıt Ol">Kayıt Ol</Link>
                </div>
              )}

              <Link
                href="/wishlist"
                className="relative text-brand-primary hover:text-brand-secondary transition duration-300 p-1"
                aria-label={`İstek Listesi, ${wishlistCount} ürün`}
                title="İstek Listem"
              >
                <HeartIcon className="h-6 w-6" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-secondary text-white text-[10px] font-bold shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <button
                className="relative text-brand-primary hover:text-brand-secondary transition duration-300 p-1"
                onClick={() => setIsCartOpen(true)}
                aria-label={`Alışveriş sepeti, ${itemCount} ürün`}
                title="Sepetim"
              >
                <CartIcon className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-secondary text-white text-[10px] font-bold shadow-sm">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden fixed top-0 left-0 h-screen w-80 bg-brand-bg shadow-2xl transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out z-50 border-r border-brand-border`}>
          <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-10 border-b border-gray-100 pb-4">
              <span className="text-2xl font-serif font-bold text-brand-primary">MiraTekstil</span>
              <button onClick={() => setIsMenuOpen(false)} aria-label="Menüyü kapat" className="text-gray-500 hover:text-brand-primary">
                <CloseIcon className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mb-8">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ürün ara..."
                  className="w-full bg-gray-50 border border-brand-border rounded-lg py-3 pl-4 pr-10 text-sm focus:outline-none focus:ring-1 focus:ring-brand-secondary"
                />
                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" aria-label="Ürün Ara">
                  <SearchIcon className="h-5 w-5" />
                </button>
              </div>
            </form>

            <nav className="flex flex-col space-y-2 flex-grow overflow-y-auto">
              {/* Mobile Mega Menu Categories */}
              {megaMenuCategories.map((cat) => (
                <div key={cat.name} className="border-b border-gray-100 pb-2 mb-2">
                  <Link
                    href={cat.path}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-brand-primary text-lg font-semibold hover:text-brand-secondary transition duration-200 py-2 px-2 block"
                    title={cat.name}
                  >
                    {cat.name}
                  </Link>
                  <div className="pl-4 space-y-1">
                    {cat.children.map((child) => (
                      <Link
                        key={child.name}
                        href={child.path}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-gray-600 text-sm hover:text-brand-secondary transition duration-200 py-1.5 px-2 block rounded hover:bg-gray-50"
                        title={child.name}
                      >
                        {child.name}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
              {/* Regular Nav Links */}
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-brand-primary text-lg font-medium hover:text-brand-secondary transition duration-200 py-3 px-2 hover:bg-gray-50 rounded-md"
                  title={link.name}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="https://www.trendyol.com/sr?mid=750999&os=1"
                target="_blank"
                rel="nofollow noreferrer"
                onClick={() => setIsMenuOpen(false)}
                className="text-orange-600 text-lg font-bold hover:text-orange-700 transition duration-200 py-3 px-2 hover:bg-orange-50 rounded-md"
                title="Trendyol Mağazamızı Ziyaret Edin"
              >
                Trendyol Mağaza
              </a>
            </nav>

            <div className="border-t border-brand-border pt-6 mt-auto space-y-4 pb-36">
              {user ? (
                <>
                  <div className="flex items-center px-2 py-2 mb-2 bg-gray-50 rounded-lg">
                    <div className="bg-brand-primary text-white rounded-full p-1 mr-3"><UserIcon className="w-4 h-4" /></div>
                    <span className="font-semibold">{user.name}</span>
                  </div>
                  <Link href="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center text-gray-600 hover:text-brand-primary px-2 py-2" title="Hesabım">Hesabım</Link>
                  <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="flex w-full items-center text-red-500 hover:text-red-700 px-2 py-2" title="Çıkış Yap">Çıkış Yap</button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="text-center text-brand-primary border border-brand-primary rounded-lg py-3 font-medium hover:bg-gray-50 transition-colors" title="Giriş Yap">Giriş Yap</Link>
                  <Link href="/auth/register" onClick={() => setIsMenuOpen(false)} className="text-center bg-brand-primary text-white rounded-lg py-3 font-medium hover:bg-brand-dark transition-colors" title="Kayıt Ol">Kayıt Ol</Link>
                </div>
              )}
            </div>
          </div>
        </div>
        {isMenuOpen && <div className="lg:hidden fixed inset-0 bg-black/40 z-40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)}></div>}
      </header>
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default Header;
