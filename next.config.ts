import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  turbopack: {
    root: process.cwd(),
  },

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  images: {
    // Görseller Next/Vercel görsel optimizasyonundan geçer: ekran boyutuna göre küçültülür ve WebP'ye çevrilir.
    // Orijinal dosyalar (Firebase/Imgur) değişmez. Kota sorunu (402) yaşanırsa geçici çözüm: aşağıya `unoptimized: true` ekleyin.
    formats: ['image/webp'],
    // Aynı görsel için yeniden dönüştürme sayısını azaltmak için uzun önbellek (31 gün).
    minimumCacheTTL: 60 * 60 * 24 * 31,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'i.imgur.com',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },
  experimental: {
  },
};

export default nextConfig;
