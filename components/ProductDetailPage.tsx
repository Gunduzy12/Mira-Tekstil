"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Product, Review, Question } from '../types';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useNotification } from '../context/NotificationContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductContext';
import { HeartIcon, ChevronRightIcon, RulerIcon, ChevronDownIcon } from '../components/Icons';
import StarRating from '../components/StarRating';
import InteractiveStarRating from '../components/InteractiveStarRating';
import { sendFormToEmail } from '../services/emailService';
import SizeGuideModal from '../components/SizeGuideModal';

interface ProductDetailPageProps {
    product: Product;
}


const maskName = (name: string) => {
    if (!name) return '*****';
    const parts = name.trim().split(' ');
    return parts.map(part => {
        if (part.length > 2) {
            return part.substring(0, 2) + '***';
        }
        return part[0] + '***';
    }).join(' ');
};

const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product }) => {
    const router = useRouter();
    const [reviews, setReviews] = useState<Review[]>(product.reviews);
    const [questions, setQuestions] = useState<Question[]>(product.questions || []);
    const [activeTab, setActiveTab] = useState<'description' | 'reviews' | 'qa'>('description');

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState<string | null>(null);
    const [selectedSize, setSelectedSize] = useState<string | null>(null);

    const [customWidth, setCustomWidth] = useState<number>(product.minWidth || 100);
    const [customHeight, setCustomHeight] = useState<number>(product.minHeight || 200);
    const [calculatedPrice, setCalculatedPrice] = useState<number>(product.priceFrom);

    // Ref for scrolling to details
    const detailsRef = useRef<HTMLDivElement>(null);

    const allImages = useMemo(() => {
        const images = [product.imageUrl, ...(product.images || []), ...product.variants.map(v => v.imageUrl).filter((url): url is string => !!url)];
        return [...new Set(images)];
    }, [product]);
    const [mainImage, setMainImage] = useState(product.imageUrl);

    const [newReviewRating, setNewReviewRating] = useState(5);
    const [newReviewAuthor, setNewReviewAuthor] = useState('');
    const [newReviewComment, setNewReviewComment] = useState('');
    const [isSubmittingReview, setIsSubmittingReview] = useState(false);

    // Q&A State
    const [qaName, setQaName] = useState('');
    const [qaEmail, setQaEmail] = useState(''); // Added Email for notification
    const [qaQuestion, setQaQuestion] = useState('');
    const [isSubmittingQa, setIsSubmittingQa] = useState(false);

    // Size Guide Modal State
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    const { addToCart } = useCart();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
    const { showNotification } = useNotification();
    const { orders } = useOrders();
    const { user } = useAuth();
    const { addQuestion } = useProducts();
    const isWishlisted = isInWishlist(product.id);

    // Initialize selection
    useEffect(() => {
        setMainImage(product.imageUrl);

        const uniqueColors = Array.from(new Set(product.variants.map(v => v.color).filter(c => !!c)));
        const uniqueSizes = Array.from(new Set(product.variants.map(v => v.size).filter(s => !!s)));

        // Only set default if nothing is selected yet or if options changed significantly
        if (!selectedColor && uniqueColors.length > 0) {
            setSelectedColor(uniqueColors.length === 1 ? (uniqueColors[0] as string) : null);
        }
        if (!selectedSize && uniqueSizes.length > 0) {
            setSelectedSize(uniqueSizes.length === 1 ? (uniqueSizes[0] as string) : null);
        }

        setQuantity(1);
        setReviews(product.reviews);
        setQuestions(product.questions || []);
        // setActiveTab('description'); // Keep tab state if user navigates back? Up to preference.

        if (product.isCustomSize) {
            setCustomWidth(product.minWidth || 100);
            setCustomHeight(product.minHeight || 200);
        }
    }, [product.id, product.imageUrl, product.isCustomSize, product.minWidth, product.minHeight, product.reviews, product.questions, product.variants]);

    // Verify if the logged-in user has purchased and received this item
    const canReview = useMemo(() => {
        if (!user) return false;
        return orders.some(order =>
            order.status === 'Teslim Edildi' &&
            order.items.some(item => item.id === product.id)
        );
    }, [orders, user, product.id]);

    // Derived Options
    const colorOptions = useMemo(() => {
        const colors = new Map<string, { imageUrl: string, available: boolean }>();
        product.variants.forEach(v => {
            if (v.color) {
                if (!colors.has(v.color)) {
                    colors.set(v.color, { imageUrl: v.imageUrl || product.imageUrl, available: v.stock > 0 });
                } else if (v.stock > 0) {
                    const existing = colors.get(v.color);
                    if (existing) existing.available = true;
                }
            }
        });
        return Array.from(colors.entries()).map(([color, data]) => ({ color, ...data }));
    }, [product]);

    const sizeOptions = useMemo(() => {
        if (product.isCustomSize) return [];

        const allSizes = [...new Set(product.variants.map(v => v.size).filter(Boolean as any as (v: string | undefined) => v is string))];
        if (!selectedColor) {
            return allSizes.map(size => ({ size, available: true }));
        }

        return allSizes.map(size => {
            const isAvailable = product.variants.some(v => v.color === selectedColor && v.size === size && v.stock > 0);
            return { size, available: isAvailable };
        });
    }, [product.variants, selectedColor, product.isCustomSize]);

    // Derived Selected Variant using useMemo to ensure fresh data
    const selectedVariant = useMemo(() => {
        if (product.isCustomSize) {
            return product.variants.find(v => v.color === selectedColor) || null;
        }

        const hasColors = colorOptions.length > 0;
        const hasSizes = sizeOptions.length > 0;

        if ((hasColors && !selectedColor) || (hasSizes && !selectedSize)) {
            return null;
        }

        return product.variants.find(v => {
            const colorMatch = !hasColors || v.color === selectedColor;
            const sizeMatch = !hasSizes || v.size === selectedSize;
            return colorMatch && sizeMatch;
        }) || null;
    }, [product.variants, selectedColor, selectedSize, colorOptions.length, sizeOptions.length, product.isCustomSize]);


    // Update calculated price for custom size (Calculated based on WIDTH only / Metretül)
    useEffect(() => {
        if (product.isCustomSize && product.pricePerSqM) {
            // 1. Temel Metretül Fiyatı (En'e göre)
            // Varsayılan birim fiyat (örn: 300 TL)
            let unitPrice = product.pricePerSqM;

            // 2. "Uzunluk arttıkça fiyat düşsün" (Kampanya Mantığı)
            // En arttıkça birim fiyattan indirim yapıyoruz (Milleti uzuna çekmek için)
            if (customWidth >= 400) {
                unitPrice -= 15; // 4 metre üstü için ciddi indirim
            } else if (customWidth >= 300) {
                unitPrice -= 10; // 3 metre üstü için indirim
            } else if (customWidth >= 200) {
                unitPrice -= 5;  // 2 metre üstü için ufak indirim
            }

            // Ana Fiyat: (En cm / 100) * Birim Fiyat
            let price = (customWidth / 100) * unitPrice;

            // 3. Boy Farkı (Çok önemli değil ama 5-10 TL ekle)
            // Standart boy (örneğin 200cm) üstüne çıkarsa cüzi bir işçilik farkı
            if (customHeight > 250) {
                price += 20;
            } else if (customHeight > 220) {
                price += 10;
            }

            setCalculatedPrice(Math.max(0, price));
        }
    }, [customWidth, customHeight, product.isCustomSize, product.pricePerSqM]);

    // Update main image when selection changes
    useEffect(() => {
        if (selectedColor) {
            const variantWithImage = product.variants.find(v => v.color === selectedColor && v.imageUrl);
            if (variantWithImage && variantWithImage.imageUrl) {
                setMainImage(variantWithImage.imageUrl);
            }
        }
    }, [selectedColor, product.variants]);

    const handleAddToCart = () => {
        if (!selectedVariant) {
            showNotification('Lütfen mevcut tüm seçenekleri belirtin.', 'error');
            return;
        }
        if (selectedVariant.stock === 0) {
            showNotification('Bu varyant stokta yok.', 'error');
            return;
        }

        if (product.isCustomSize) {
            const customVariant = {
                ...selectedVariant,
                price: calculatedPrice,
                sku: `${selectedVariant.sku}-W${customWidth}-H${customHeight}`
            };
            addToCart(product, customVariant, quantity);
        } else {
            addToCart(product, selectedVariant, quantity);
        }
    };

    const handleWishlistToggle = () => {
        if (isWishlisted) removeFromWishlist(product.id);
        else addToWishlist(product);
    };

    const handleScrollToDetails = () => {
        if (detailsRef.current) {
            detailsRef.current.scrollIntoView({ behavior: 'smooth' });
            setActiveTab('description');
        }
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newReviewComment.trim()) return;
        setIsSubmittingReview(true);

        // Use logged in user's name if available, otherwise form name (though logic hides form if not logged in)
        const authorName = user?.name || newReviewAuthor || "Misafir";

        try {
            const reviewData = { productName: product.name, author: authorName, rating: newReviewRating, comment: newReviewComment };
            await sendFormToEmail('Yeni Ürün Değerlendirmesi', reviewData);

            const newReview: Review = {
                id: Date.now(),
                author: authorName,
                rating: newReviewRating,
                comment: newReviewComment,
                date: new Date().toISOString().split('T')[0]
            };

            // This is a local update for Reviews. In a full implementation, we'd persist reviews to DB similar to Questions.
            setReviews(prev => [newReview, ...prev]);
            setNewReviewAuthor('');
            setNewReviewComment('');
            setNewReviewRating(5);
            showNotification('Değerlendirmeniz için teşekkür ederiz!', 'success');
        } catch {
            showNotification('Bir hata oluştu.', 'error');
        } finally {
            setIsSubmittingReview(false);
        }
    };

    const handleQaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!qaQuestion.trim()) return;
        setIsSubmittingQa(true);

        const askerName = user?.name || qaName || "Misafir";
        const askerEmail = user?.email || qaEmail;

        if (!askerEmail) {
            showNotification('Cevap alabilmeniz için e-posta adresi gereklidir.', 'error');
            setIsSubmittingQa(false);
            return;
        }

        try {
            // Send notification email to seller
            await sendFormToEmail('Satıcıya Sor', {
                productName: product.name,
                question: qaQuestion,
                asker: askerName,
                email: askerEmail
            });

            // Persist to database
            const newQuestion: Question = {
                id: Date.now(),
                user: askerName,
                email: askerEmail, // Save email for reply
                text: qaQuestion,
                date: new Date().toISOString().split('T')[0],
            };

            await addQuestion(product.id, newQuestion);

            setQaQuestion('');
            setQaName('');
            setQaEmail('');
            // Notification is handled inside addQuestion
        } catch {
            showNotification('Hata oluştu.', 'error');
        } finally {
            setIsSubmittingQa(false);
        }
    }

    const canAddToCart = selectedVariant && selectedVariant.stock > 0;
    const inputClasses = "w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-brand-secondary focus:border-brand-secondary transition-all shadow-sm";

    // Fiyat Hesaplama
    const displayPrice = product.isCustomSize
        ? calculatedPrice
        : (selectedVariant ? selectedVariant.price : product.priceFrom);

    // Original Price Calculation
    const displayOriginalPrice = !product.isCustomSize && selectedVariant
        ? (selectedVariant.originalPrice || undefined)
        : product.originalPrice;


    // JSON-LD Structured Data for SEO
const BASE_URL = "https://www.miratekstiltr.com";

const productPath =
  product.parentSlug && product.categorySlug && product.slug
    ? `/${product.parentSlug}/${product.categorySlug}/${product.slug}`
    : `/${product.slug || product.id}`;

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Anasayfa',
          item: BASE_URL
        },
        ...(product.parentSlug ? [{
          '@type': 'ListItem',
          position: 2,
          name: product.category,
          item: `${BASE_URL}/${product.parentSlug}`
        }] : []),
        {
          '@type': 'ListItem',
          position: product.parentSlug ? 3 : 2,
          name: product.name,
          item: `${BASE_URL}${productPath}`
        }
      ]
    },
    {
      '@type': 'Product',
      name: product.name,
      image: allImages,
      description: product.description,
      sku: product.id,
      mpn: product.id,
      brand: {
        '@type': 'Brand',
        name: product.brand || 'MiraTekstil'
      },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'TRY',
        price: displayPrice.toFixed(2),
        availability:
          (selectedVariant?.stock || 0) > 0
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
        itemCondition: 'https://schema.org/NewCondition',
        url: `${BASE_URL}${productPath}`
      },
      aggregateRating: product.averageRating
        ? {
            '@type': 'AggregateRating',
            ratingValue: product.averageRating,
            reviewCount: reviews.length || 1
          }
        : undefined,
      review: reviews.map(r => ({
        '@type': 'Review',
        author: { '@type': 'Person', name: r.author },
        datePublished: r.date,
        reviewBody: r.comment,
        reviewRating: { '@type': 'Rating', ratingValue: r.rating }
      }))
    }
  ]
};

    return (
        <div className="bg-brand-bg">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <nav aria-label="Breadcrumb" className="container mx-auto px-4 sm:px-6 py-4 text-sm text-gray-500">
  <ol className="list-none p-0 inline-flex flex-wrap">

    <li className="flex items-center">
      <Link href="/" className="hover:text-brand-primary">Anasayfa</Link>
      <ChevronRightIcon className="w-3 h-3 mx-2" />
    </li>

    {product.parentSlug && (
      <li className="flex items-center">
        <Link href={`/${product.parentSlug}`} className="hover:text-brand-primary">
          {product.category}
        </Link>
        <ChevronRightIcon className="w-3 h-3 mx-2" />
      </li>
    )}

    <li className="flex items-center">
      <span className="text-gray-700 font-medium" aria-current="page">
        {product.name}
      </span>
    </li>

  </ol>
</nav>

            <div className="container mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">

                    {/* Image Column: 5 cols (approx 41%) - Reduces image size on desktop */}
                    <div className="lg:col-span-5">
                        <div className="relative mb-4 border border-brand-border rounded-lg overflow-hidden bg-white shadow-sm">
                            <div className="aspect-[4/5] w-full relative group">
                                <img
                                    src={mainImage}
                                    alt={`${product.name} - MiraTekstil ${selectedColor ? selectedColor : ''}`}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                                    <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded shadow-lg z-10 animate-pulse">
                                        % {Math.round(((displayOriginalPrice - displayPrice) / displayOriginalPrice) * 100)} İndirim
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-2">
                            {allImages.map((img, index) => (
                                <button
                                    key={index}
                                    onMouseEnter={() => setMainImage(img)}
                                    onClick={() => setMainImage(img)}
                                    className={`relative aspect-square border-2 rounded-md transition-all overflow-hidden bg-white ${img === mainImage ? 'border-brand-secondary ring-1 ring-brand-secondary opacity-100' : 'border-transparent hover:border-gray-300 opacity-80 hover:opacity-100'}`}
                                    aria-label={`${product.name} görseli ${index + 1}`}
                                >
                                    <img src={img} alt={`${product.name} detay ${index + 1}`} className="w-full h-full object-cover" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Content Column: 7 cols (approx 58%) */}
                    <main className="lg:col-span-7 pt-2">
                        <p className="text-sm uppercase tracking-widest text-brand-secondary font-bold mb-1">{product.brand}</p>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-brand-primary mb-3">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6 text-sm text-brand-accent">
                            <div className="flex items-center gap-1" title={`${product.averageRating} yıldız`}>
                                <StarRating rating={product.averageRating} />
                                <span className="ml-1 underline cursor-pointer hover:text-brand-primary" onClick={() => { handleScrollToDetails(); setActiveTab('reviews'); }}>({reviews.length} Değerlendirme)</span>
                            </div>
                        </div>

                        <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                            <div className="flex flex-col">
                                {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                                    <div className="flex items-center gap-3 mb-1">
                                        <p className="text-xl text-gray-400 line-through font-medium">
                                            {displayOriginalPrice.toFixed(2)} TL
                                        </p>
                                        <span className="text-red-600 font-bold text-xs uppercase bg-red-100 px-2 py-0.5 rounded tracking-wide">
                                            Kampanyalı Fiyat
                                        </span>
                                    </div>
                                )}
                                <p className={`font-serif font-bold ${displayOriginalPrice && displayOriginalPrice > displayPrice ? 'text-4xl text-brand-primary' : 'text-3xl text-brand-primary'}`}>
                                    {displayPrice.toFixed(2)} TL
                                </p>
                            </div>
                            {displayOriginalPrice && displayOriginalPrice > displayPrice && (
                                <div className="mt-3 text-sm text-green-700 font-bold flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-1">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 4.5ZM3 4.5v15m0 0c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3a.75.75 0 0 0-.75-.75H3.75a.75.75 0 0 0-.75.75v1.5m0 0v15m0 0c0 .414.336.75.75.75h1.5a.75.75 0 0 0 .75-.75V3a.75.75 0 0 0-.75.75H3.75a.75.75 0 0 0-.75.75v1.5m12 12h-2.33v-5.5a1.5 1.5 0 0 1 3 0v5.5Z" />
                                    </svg>
                                    Toplam Kazancınız: <span className="ml-1 underline">{(displayOriginalPrice - displayPrice).toFixed(2)} TL</span>
                                </div>
                            )}
                        </div>

                        <div className="prose prose-sm text-gray-600 mb-4 max-w-none">
                            <p>{product.description}</p>
                        </div>

                        <button
                            onClick={handleScrollToDetails}
                            className="flex items-center bg-[#252525] text-white px-5 py-3 rounded-md font-medium text-sm hover:bg-black transition-colors mb-8 group"
                        >
                            <span className="mr-3">Ürünün tüm özellikleri</span>
                            <ChevronDownIcon className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                        </button>

                        {colorOptions.length > 0 && (
                            <div className="mb-6">
                                <p className="text-sm font-semibold text-brand-primary mb-3">Renk: <span className="font-normal text-brand-accent ml-1">{selectedColor}</span></p>
                                <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Renk Seçenekleri">
                                    {colorOptions.map(({ color, imageUrl }) => (
                                        <button
                                            key={color}
                                            onClick={() => setSelectedColor(color)}
                                            className={`w-20 h-20 border-2 rounded-lg p-1 transition-all relative bg-white ${selectedColor === color ? 'border-brand-secondary ring-1 ring-brand-secondary scale-105' : 'border-brand-border hover:border-gray-400'}`}
                                            title={color}
                                            role="radio"
                                            aria-checked={selectedColor === color}
                                        >
                                            <img src={imageUrl} alt={color} className="w-full h-full object-cover rounded-sm" />
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {!product.isCustomSize && sizeOptions.length > 0 && (
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-brand-primary mb-3 block">Boyut / Ebat</label>
                                <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Boyut Seçenekleri">
                                    {sizeOptions.map(({ size, available }) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            disabled={!available}
                                            role="radio"
                                            aria-checked={selectedSize === size}
                                            className={`px-5 py-2.5 border rounded-md text-sm font-medium transition-all transform active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed ${selectedSize === size ? 'bg-brand-primary text-white border-brand-primary shadow-md' : 'bg-white border-brand-border text-brand-primary hover:border-brand-primary hover:bg-gray-50'}`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product.isCustomSize && (
                            <div className="mb-6 bg-brand-light p-6 rounded-lg border border-brand-border shadow-inner">
                                <h3 className="font-serif font-bold text-lg mb-4 text-brand-primary flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>
                                    Özel Ölçü Girişi (cm)
                                </h3>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">En x Boy Seçiniz</label>
                                    <div className="relative">
                                        <select
                                            value={`${customWidth}x${customHeight}`}
                                            onChange={(e) => {
                                                const [w, h] = e.target.value.split('x').map(Number);
                                                setCustomWidth(w);
                                                setCustomHeight(h);
                                            }}
                                            className="w-full appearance-none bg-white border border-gray-300 px-4 py-3 pr-8 rounded-lg text-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-secondary focus:border-brand-secondary cursor-pointer shadow-sm text-base"
                                        >
                                            {/* Dinamik Ölçü Listesi Oluşturma */}
                                            {(() => {
                                                const options = [];
                                                const minW = product.minWidth || 50;
                                                const maxW = product.maxWidth || 300;
                                                const minH = product.minHeight || 200;
                                                const maxH = product.maxHeight || 270;

                                                // Genişlik adımları (10cm)
                                                for (let w = minW; w <= maxW; w += 10) {
                                                    // Yükseklik adımları (10cm veya sabit standartlar)
                                                    for (let h = minH; h <= maxH; h += 10) {
                                                        options.push(
                                                            <option key={`${w}x${h}`} value={`${w}x${h}`}>
                                                                {w} x {h} cm
                                                            </option>
                                                        );
                                                    }
                                                }

                                                // Eğer listede hiç eleman yoksa (edge case) manuel bir tane ekle
                                                if (options.length === 0) {
                                                    options.push(<option key="default" value="100x200">100 x 200 cm</option>);
                                                }
                                                return options;
                                            })()}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <ChevronDownIcon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        * İstediğiniz ölçü listede yoksa en yakın ölçüyü seçip not kısmında belirtebilirsiniz.
                                    </p>
                                </div>
                                <div className="mt-4 p-4 bg-blue-50 text-blue-900 text-sm rounded border border-blue-100 flex items-start shadow-sm">
                                    <RulerIcon className="w-5 h-5 mr-3 mt-0.5 text-blue-600 flex-shrink-0" />
                                    <p>
                                        Fiyatlandırma <strong>en ölçüsüne göre</strong> yapılmaktadır. Boy ölçüsü fiyata etki etmez.
                                        <br />
                                        Metretül (mt) Fiyatı: <strong>{product.pricePerSqM?.toFixed(2)} TL</strong>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* SIZE GUIDE BUTTON - Only if enabled for this product */}
                        {product.showSizeGuide && (
                            <div className="mb-6 border-t border-gray-100 pt-4">
                                <h3 className="text-sm font-semibold text-brand-primary mb-2">Ölçü Rehberi</h3>
                                <button
                                    onClick={() => setIsSizeGuideOpen(true)}
                                    className="flex items-center bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 px-4 py-3 rounded-lg w-full md:w-auto transition-colors font-medium group"
                                >
                                    <div className="bg-orange-100 p-1.5 rounded-full mr-3 text-orange-600 group-hover:bg-white transition-colors">
                                        <RulerIcon className="w-5 h-5" />
                                    </div>
                                    <span>Ölçü alma rehberi</span>
                                    <ChevronRightIcon className="w-4 h-4 ml-auto text-orange-400 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        )}

                        {product.featuredAttributes && product.featuredAttributes.length > 0 && (
                            <div className="mb-8 mt-6">
                                <h3 className="text-lg font-bold text-brand-primary mb-4">Öne Çıkan Özellikler:</h3>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {product.featuredAttributes.map((attr, idx) => (
                                        <div key={idx} className="bg-[#f9f9f9] p-3 rounded-md border border-[#e5e5e5] flex flex-col items-start justify-center">
                                            <p className="text-xs text-gray-500 mb-1">{attr.label}</p>
                                            <p className="font-semibold text-brand-primary text-sm leading-tight">{attr.value}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex items-stretch gap-4 my-8 pb-8 border-b border-brand-border">
                            <button
                                onClick={handleAddToCart}
                                disabled={!canAddToCart}
                                className="flex-1 font-bold py-4 px-6 bg-brand-primary text-white rounded-md hover:bg-brand-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0"
                            >
                                {canAddToCart ? (product.isCustomSize ? `Sepete Ekle (${calculatedPrice.toFixed(2)} TL)` : 'Sepete Ekle') : (selectedVariant && selectedVariant.stock === 0 ? 'Tükendi' : 'Seçenekleri Belirleyin')}
                            </button>
                            <button
                                onClick={handleWishlistToggle}
                                className="p-4 border border-brand-border text-brand-accent rounded-md hover:border-brand-primary hover:text-red-500 hover:bg-red-50 transition-colors group"
                                aria-label={isWishlisted ? "Favorilerden Çıkar" : "Favorilere Ekle"}
                            >
                                <HeartIcon className="h-6 w-6 group-hover:scale-110 transition-transform" fill={isWishlisted ? 'currentColor' : 'none'} />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                <span>Orijinal Ürün Garantisi</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <svg className="w-5 h-5 text-brand-secondary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                <span>Hızlı Kargo</span>
                            </div>
                        </div>
                    </main>
                </div>
            </div>

            <div ref={detailsRef} className="bg-brand-light border-t border-brand-border mt-8">
                <div className="container mx-auto px-6 py-12">
                    <div className="border-b border-brand-border max-w-4xl mx-auto">
                        <div className="flex flex-wrap justify-center sm:space-x-12 -mb-px">
                            <button onClick={() => setActiveTab('description')} className={`py-4 px-4 sm:px-1 border-b-2 text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'description' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Ürün Özellikleri</button>
                            <button onClick={() => setActiveTab('reviews')} className={`py-4 px-4 sm:px-1 border-b-2 text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'reviews' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Değerlendirmeler ({reviews.length})</button>
                            <button onClick={() => setActiveTab('qa')} className={`py-4 px-4 sm:px-1 border-b-2 text-base sm:text-lg font-medium transition-colors whitespace-nowrap ${activeTab === 'qa' ? 'border-brand-primary text-brand-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>Satıcıya Sor ({questions.length})</button>
                        </div>
                    </div>

                    <div className="mt-10 max-w-4xl mx-auto min-h-[300px]">
                        {activeTab === 'description' && (
                            <section className="prose max-w-none text-brand-accent bg-white p-8 rounded-lg shadow-sm border border-brand-border">
                                <h2 className="text-xl font-serif text-brand-primary mb-4">Ürün Açıklaması</h2>
                                <p className="mb-6 leading-relaxed">{product.description}</p>
                                <h4 className="font-bold text-brand-primary mb-2">Detaylar ve Bakım</h4>
                                <ul className="list-disc list-inside space-y-2 marker:text-brand-secondary">
                                    {product.details.map((detail, index) => <li key={index}>{detail}</li>)}
                                </ul>
                            </section>
                        )}

                        {activeTab === 'reviews' && (
                            <section className="bg-white p-8 rounded-lg shadow-sm border border-brand-border">
                                <h2 className="text-2xl font-serif mb-6 text-center text-brand-primary">Müşteri Yorumları</h2>
                                {reviews.length > 0 ? (
                                    <div className="space-y-8">
                                        {reviews.map(review => (
                                            <article key={review.id} className="border-b border-brand-border pb-6 last:border-0">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center">
                                                        <StarRating rating={review.rating} />
                                                        <p className="ml-4 font-bold text-brand-primary">{maskName(review.author)}</p>
                                                    </div>
                                                    <time className="text-gray-400 text-xs">{new Date(review.date).toLocaleDateString('tr-TR')}</time>
                                                </div>
                                                <p className="text-gray-600 mt-2">{review.comment}</p>
                                            </article>
                                        ))}
                                    </div>
                                ) : <p className="text-center text-gray-500 py-8">Bu ürün için henüz yorum yapılmamış.</p>}

                                <div className="mt-12 pt-8 border-t border-brand-border bg-gray-50 p-6 rounded-lg">
                                    {canReview ? (
                                        <>
                                            <h3 className="text-xl font-serif mb-6 text-center text-brand-primary">Yorum Yapın</h3>
                                            <form onSubmit={handleReviewSubmit} className="space-y-4 max-w-xl mx-auto">
                                                <div>
                                                    <label className="block text-sm font-medium text-brand-primary mb-2 text-center">Bu ürüne puan verin</label>
                                                    <div className="flex justify-center">
                                                        <InteractiveStarRating rating={newReviewRating} onRatingChange={setNewReviewRating} />
                                                    </div>
                                                </div>
                                                {!user && (
                                                    <div>
                                                        <label htmlFor="author" className="block text-sm font-medium text-brand-primary mb-1">İsim Soyisim</label>
                                                        <input type="text" id="author" value={newReviewAuthor} onChange={(e) => setNewReviewAuthor(e.target.value)} className={inputClasses} required placeholder="Adınız" />
                                                    </div>
                                                )}
                                                <div>
                                                    <label htmlFor="comment" className="block text-sm font-medium text-brand-primary mb-1">Değerlendirmeniz</label>
                                                    <textarea id="comment" rows={4} value={newReviewComment} onChange={(e) => setNewReviewComment(e.target.value)} className={inputClasses} required placeholder="Ürün hakkındaki düşünceleriniz..."></textarea>
                                                </div>
                                                <button type="submit" disabled={isSubmittingReview} className="w-full bg-brand-primary text-white py-3 px-4 rounded-md hover:bg-brand-dark transition-colors disabled:opacity-50 font-medium">
                                                    {isSubmittingReview ? 'Gönderiliyor...' : 'Yorumu Gönder'}
                                                </button>
                                            </form>
                                        </>
                                    ) : (
                                        <div className="text-center py-6">
                                            <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg inline-block text-sm shadow-sm border border-yellow-100">
                                                <span className="font-bold flex items-center justify-center gap-2 mb-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                                    Değerlendirme Yapılamıyor
                                                </span>
                                                <p>Bu ürünü değerlendirmek için ürünü satın almış, teslim almış olmanız ve giriş yapmanız gerekmektedir.</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </section>
                        )}

                        {activeTab === 'qa' && (
                            <section className="bg-white p-8 rounded-lg shadow-sm border border-brand-border">
                                <h2 className="text-2xl font-serif mb-6 text-center text-brand-primary">Satıcıya Sor</h2>

                                {/* Previous Questions List */}
                                {questions.length > 0 && (
                                    <div className="space-y-6 mb-10">
                                        {questions.map((q) => (
                                            <div key={q.id} className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-gray-700 text-sm">{maskName(q.user)}</span>
                                                        <span className="text-xs text-gray-400">| {new Date(q.date).toLocaleDateString('tr-TR')}</span>
                                                    </div>
                                                </div>
                                                <p className="text-gray-800 font-medium mb-3">Soru: {q.text}</p>
                                                {q.answer ? (
                                                    <div className="bg-white p-3 rounded border-l-4 border-brand-secondary text-sm">
                                                        <p className="font-bold text-brand-secondary mb-1 flex items-center gap-1">
                                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" /></svg>
                                                            Satıcı Cevabı:
                                                        </p>
                                                        <p className="text-gray-600">{q.answer}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-xs text-gray-500 italic">Satıcı henüz cevaplamadı.</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="bg-gray-50 p-6 rounded-lg max-w-xl mx-auto border border-gray-200">
                                    <h4 className="font-bold text-brand-primary mb-4">Yeni Soru Sor</h4>
                                    <form onSubmit={handleQaSubmit} className="space-y-4">
                                        {!user && (
                                            <>
                                                <div>
                                                    <label htmlFor="qaName" className="block text-sm font-medium text-brand-primary mb-1">İsim (İsteğe Bağlı)</label>
                                                    <input type="text" id="qaName" value={qaName} onChange={(e) => setQaName(e.target.value)} className={inputClasses} placeholder="Adınız" />
                                                </div>
                                                <div>
                                                    <label htmlFor="qaEmail" className="block text-sm font-medium text-brand-primary mb-1">E-posta (Cevap İçin)</label>
                                                    <input type="email" id="qaEmail" value={qaEmail} onChange={(e) => setQaEmail(e.target.value)} className={inputClasses} placeholder="ornek@email.com" required />
                                                    <p className="text-xs text-gray-500 mt-1">Sorunuz cevaplandığında bildirim almanız için gereklidir.</p>
                                                </div>
                                            </>
                                        )}
                                        <div>
                                            <label htmlFor="question" className="block text-sm font-medium text-brand-primary mb-1">Sorunuz</label>
                                            <textarea id="question" rows={5} value={qaQuestion} onChange={(e) => setQaQuestion(e.target.value)} className={inputClasses} required placeholder="Ürün hakkında merak ettiklerinizi sorun..."></textarea>
                                            <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                KVKK gereği isminiz "Ah*** Yı***" şeklinde maskelenerek gösterilecektir.
                                            </p>
                                        </div>
                                        <button type="submit" disabled={isSubmittingQa} className="w-full bg-brand-primary text-white py-3 px-4 rounded-md hover:bg-brand-dark transition-colors disabled:opacity-50 font-medium">
                                            {isSubmittingQa ? 'Gönderiliyor...' : 'Soruyu Gönder'}
                                        </button>
                                    </form>
                                </div>
                            </section>
                        )}
                    </div>
                </div>
            </div>

            {/* Size Guide Modal */}
            <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
        </div>
    );
};

export default ProductDetailPage;
