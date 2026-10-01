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
    // Vercel Image Optimization kotası dolduğunda görseller 402 dönmesin.
    // Kaynak görselleri doğrudan Firebase/Imgur üzerinden sunuyoruz.
    unoptimized: true,
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
