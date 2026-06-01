import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
    try {
        // 1. Anasayfa önbelleğini temizle
        revalidatePath('/');
        
        // 2. Shop sayfası önbelleğini temizle
        revalidatePath('/shop');
        
        // 3. Dinamik perde, ev-tekstili vb. tüm kategori ve ürün detay sayfalarını temizle
        // Next.js App Router'da 'layout' seçeneği o path'in altındaki tüm sayfaları da revalidate eder.
        revalidatePath('/[parentSlug]', 'layout');
        revalidatePath('/blog', 'layout');

        console.log('Next.js cache revalidation triggered successfully.');

        return NextResponse.json({ 
            success: true, 
            message: 'Tüm sayfa önbellekleri (Anasayfa, Shop, Kategoriler) başarıyla sıfırlandı.',
            now: Date.now() 
        });
    } catch (err: any) {
        console.error('Revalidation error:', err);
        return NextResponse.json({ 
            success: false, 
            error: err.message || 'Önbellek temizlenirken hata oluştu.' 
        }, { status: 500 });
    }
}
