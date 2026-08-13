import { Product, HeroBanner, Coupon, Review, SiteSettings } from '../types';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  deliveryFeeInside: 60,
  deliveryFeeOutside: 120,
  bkashNumber: '',
  nagadNumber: '',
  whatsappNumber: '',
  whatsappGroup: 'https://chat.whatsapp.com/GODppLnNvhuITvzjePfsOr',
  telegramChannel: 'https://t.me/Trendify_Sherpur',
  telegramSupport: 'https://t.me/TrendifySherpur',
  facebookUrl: 'https://www.facebook.com/share/1LptghxXW8/',
  tiktokUrl: 'https://tiktok.com/@trendifysherpur',
};

export const INITIAL_BANNERS: HeroBanner[] = [];

export const INITIAL_COUPONS: Coupon[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

export const INITIAL_REVIEWS: Review[] = [];
