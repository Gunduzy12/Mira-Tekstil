import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.miratekstiltr.com';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/account/',
          '/checkout/',
          '/admin/',
          '/api/',
          '/shop',      // /shop
          '/shop?',     // /shop?category=...
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
