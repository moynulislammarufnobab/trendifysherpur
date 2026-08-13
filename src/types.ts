export type Language = 'bn' | 'en';
export type ThemeMode = 'light' | 'dark';

export interface ProductVariant {
  colors: string[];
  sizes: string[];
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number; // 1-5
  comment: string;
  photo?: string;
  videoUrl?: string;
  createdAt: string;
}

export interface Product {
  id: string;
  title: string;
  titleBn: string;
  price: number; // BDT
  originalPrice: number; // BDT
  category: 'watch' | 'electronics' | 'gadgets' | 'shoes' | 'lifestyle';
  images: string[];
  description: string;
  descriptionBn: string;
  inStock: boolean;
  stockCount: number;
  isFlashSale?: boolean;
  flashSaleEndTime?: string; // ISO string or time string
  variants: ProductVariant;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  createdAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface ShippingDetails {
  fullName: string;
  phone: string;
  deliveryArea: 'inside' | 'outside'; // inside Sherpur vs outside
  address: string;
  district?: string;
  thana?: string;
  notes?: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad';
export type PaymentStatus = 'Pending' | 'Approved' | 'Rejected';
export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  shippingDetails: ShippingDetails;
  items: {
    productId: string;
    title: string;
    titleBn?: string;
    price: number;
    quantity: number;
    selectedColor?: string;
    selectedSize?: string;
    image: string;
  }[];
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  senderPhone?: string;
  trxId?: string;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  appliedCoupon?: string;
  referralCode?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface HeroBanner {
  id: string;
  title: string;
  titleBn: string;
  subtitle: string;
  subtitleBn: string;
  tag: 'Smart Choice' | 'Trendy Choice';
  image: string;
  linkCategory?: string;
  active: boolean;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number; // e.g. 10 for 10% or 100 for 100 BDT
  minSpend: number;
  active: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  phone?: string;
  address?: string;
  referralCode: string;
  referredBy?: string;
  referralEarnings: number; // BDT earned
  isAdmin: boolean;
  createdAt: string;
}

export interface SiteSettings {
  deliveryFeeInside: number; // Default: 60
  deliveryFeeOutside: number; // Default: 120
  bkashNumber: string; // 01954833730
  nagadNumber: string; // 01954833730
  whatsappNumber: string; // 8801954833730
  whatsappGroup: string; // https://chat.whatsapp.com/GODppLnNvhuITvzjePfsOr
  telegramChannel: string; // https://t.me/Trendify_Sherpur
  telegramSupport: string; // https://t.me/TrendifySherpur
  facebookUrl: string; // https://facebook.com/trendifysherpur
  tiktokUrl: string; // https://tiktok.com/@trendifysherpur
}
