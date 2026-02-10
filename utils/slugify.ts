export const createSlug = (name: string, id: string): string => {
    if (!name) return id;

   
    const stopWords = ['ve', 'ile', 'icin', 'daha', 'cok', 'en', 'yeni', 'ozel', 'uygun'];

    let slug = name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
        .trim();

    // Remove stop words
    stopWords.forEach(word => {
        const regex = new RegExp(`\\b${word}\\b`, 'g');
        slug = slug.replace(regex, '');
    });

    slug = slug
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-'); // Remove duplicate -

    // Limit length to ~50-60 chars for SEO friendliness, but keep full words
    if (slug.length > 60) {
        slug = slug.substring(0, 60).replace(/-[^-]*$/, '');
    }

    return `${slug}-${id}`;
};

export const extractIdFromSlug = (slug: string): string => {
    // ID is always the last part after the last hyphen
    const parts = slug.split('-');
    return parts.pop() || slug;
};
