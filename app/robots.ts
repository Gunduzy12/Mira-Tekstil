import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://www.miratekstiltr.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/account/', '/checkout/', '/admin/', '/api/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
