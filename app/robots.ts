import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://miratekstiltr.com';

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/account/', '/checkout/', '/admin/', '/api/', '/shop'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
