export const createSlug = (name: string, id: string): string => {
    if (!name) return id;

    const slug = name
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '') // Remove invalid chars
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/-+/g, '-'); // Remove duplicate -

    return `${slug}-${id}`;
};

export const extractIdFromSlug = (slug: string): string => {
    // ID is always the last part after the last hyphen
    const parts = slug.split('-');
    return parts.pop() || slug;
};
