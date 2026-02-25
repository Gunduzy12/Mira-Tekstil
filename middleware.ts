import { NextRequest, NextResponse } from 'next/server';
import { getShopCategoryRedirect } from './data/redirectMap';

export function middleware(request: NextRequest) {
    const { pathname, searchParams } = request.nextUrl;

    // 1) /shop?category=X → redirect to SEO URL
    if (pathname === '/shop' && searchParams.has('category')) {
        const categoryParam = searchParams.get('category') || '';
        const newUrl = getShopCategoryRedirect(categoryParam);

        if (newUrl) {
            return NextResponse.redirect(new URL(newUrl, request.url), 301);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/shop'],
};
