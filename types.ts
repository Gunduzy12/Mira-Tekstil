export interface Review {
  id: number;
  author: string;
  rating: number; // 1 to 5
  comment: string;
  date: string;
}

export interface Question {
  id: number;
  user: string;
  email?: string; // Added email field for notifications
  text: string;
  answer?: string;
  date: string;
}

export interface ProductVariant {
  sku: string;
  price: number;
  originalPrice?: number;
  stock: number;
  color?: string;
  size?: string;
  imageUrl?: string;
}

export interface ProductAttribute {
  label: string;
  value: string;
}

export interface Product {
  id: string; // Changed to string for Firestore compatibility
  name: string;
  brand: string;
  priceFrom: number;
  originalPrice?: number;
  category: string;
  imageUrl: string;
  images?: string[];
  description: string;
  details: string[];
  averageRating: number;
  reviews: Review[];
  questions?: Question[]; // Added questions array
  reviewCount?: number;
  questionCount?: number;
  favoritesCount?: number;
  badges?: string[];
  coupons?: string[];
  userBenefit?: string;
  variants: ProductVariant[];
  features?: string[];
  featuredAttributes?: ProductAttribute[]; // New field for "Öne Çıkan Özellikler"
  advantageTier?: 'Süper Avantajlı' | 'Çok Avantajlı' | 'Avantajlı' | null; // HACI: null eklendi
  isFeatured?: boolean;
  isDeal?: boolean;
  discountEndDate?: string | null; // HACI: null eklendi

  // Custom Size Fields
  isCustomSize?: boolean;
  pricePerSqM?: number;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;

  // New Feature
  showSizeGuide?: boolean;

  // SEO Slug Fields (migration ile eklenir)
  slug?: string;
  categorySlug?: string;
  parentSlug?: string;
  subcategory?: string;
  seoTitle?: string;
}


export interface CartItem {
  cartItemId: string; // This will be the variant's SKU or a generated ID for custom sizes
  productId: string; // Changed to string
  productName: string;
  quantity: number;
  variant: ProductVariant;
  productImageUrl: string;
  customDimensions?: {
    width: number;
    height: number;
  };
}

export interface OrderItem {
  id: string; // product id changed to string
  name: string;
  price: number; // variant price
  imageUrl: string;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
  customDimensions?: {
    width: number;
    height: number;
  };
}

export type ShippingCompany = 'Yurtiçi Kargo' | 'Aras Kargo' | 'MNG Kargo' | 'Sürat Kargo' | 'PTT Kargo' | 'Trendyol Express' | 'UPS Kargo';

export interface Order {
  id: string;
  date: string;
  status: 'Teslim Edildi' | 'Yolda' | 'İşleniyor' | 'Kargolandı' | 'Ödeme Bekleniyor';
  items: OrderItem[];
  total: number;
  shippingAddress: string;

  // Added for Notifications
  customerName?: string;
  email?: string;
  phone?: string;
  userId?: string; // Added for filtering permissions

  trackingNumber?: string;
  shippingCompany?: ShippingCompany;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  date: string;
  status: 'Talep Alındı' | 'İnceleniyor' | 'Onaylandı' | 'Reddedildi';
  items: OrderItem[];
  returnCode?: string;
}

export interface Category {
  id: string; // Changed to string for Firestore
  name: string;
  imageUrl: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: 'percent' | 'fixed'; // Yüzde veya Sabit Tutar
  value: number; // Örn: 10 (%10) veya 100 (100 TL)
  minSpend?: number;
  expirationDate?: string;
  isActive: boolean;
}

// Updated User Interface for Firebase
export interface User {
  id: string; // Changed from number to string for Firebase UID
  name: string;
  email: string;
  role?: 'admin' | 'customer';
  createdAt?: string;
}

// SEO Types
export interface SEOContentBlock {
  type: 'paragraph' | 'heading' | 'list';
  content: string;
  items?: string[]; // for list type
}

export interface CategoryFAQ {
  question: string;
  answer: string;
}

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface SEOCategory {
  parentSlug: string;
  categorySlug: string;
  firebaseCategoryName: string;
  title: string;
  metaDescription: string;
  h1: string;
  seoBlocks: SEOContentBlock[];
  faq: CategoryFAQ[];
  keywords: string[];
}

export interface SEOParentCategory {
  slug: string;
  name: string;
  title: string;
  metaDescription: string;
  h1: string;
  seoBlocks: SEOContentBlock[];
  children: { name: string; slug: string; description: string }[];
}

export interface SEOBlogTopic {
  slug: string;
  title: string;
  metaDescription: string;
  excerpt: string;
  content: SEOContentBlock[];
}