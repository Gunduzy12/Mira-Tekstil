import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const baseUrl = 'https://miratekstiltr.com'; // Replace with actual domain

    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/account/', '/checkout/', '/admin/'],
        },
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
