import React from 'react';
import { Star, Heart, ShoppingCart, Eye, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { useApp } from '../context/AppContext';
import { cleanImageUrl, handleImageError } from '../lib/imageUtils';

interface ProductCardProps {
  product: Product;
  isFlashSale?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, isFlashSale }) => {
  const { language, addToCart, wishlist, toggleWishlist, setSelectedProductForModal } = useApp();

  const isLiked = wishlist.includes(product.id);
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="group relative bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden">
      {/* Top Image Container */}
      <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 overflow-hidden cursor-pointer" onClick={() => setSelectedProductForModal(product)}>
        <img 
          src={cleanImageUrl(product.images[0])} 
          alt={product.title}
          referrerPolicy="no-referrer"
          onError={handleImageError}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-500"
        />

        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[10px] sm:text-xs px-2 py-0.5 rounded-md shadow-md uppercase">
            -{discountPercent}% OFF
          </div>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute top-2 right-2 p-2 rounded-full shadow-md backdrop-blur-md transition-all ${
            isLiked 
              ? 'bg-rose-500 text-white scale-110' 
              : 'bg-white/80 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-white' : ''}`} />
        </button>

        {/* Quick View Floating Button */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="bg-[#0A2342] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
            <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{language === 'bn' ? 'বিস্তারিত দেখুন' : 'Quick View'}</span>
          </span>
        </div>
      </div>

      {/* Body Info */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category Badge & Rating */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
            <span className="uppercase font-bold tracking-wider text-[#D4AF37]">
              {product.category}
            </span>
            <div className="flex items-center space-x-1 font-semibold text-amber-500">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{product.rating}</span>
              <span className="text-slate-400">({product.reviewCount})</span>
            </div>
          </div>

          {/* Title */}
          <h4 
            onClick={() => setSelectedProductForModal(product)}
            className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white line-clamp-2 hover:text-[#D4AF37] transition-colors cursor-pointer mb-2"
          >
            {language === 'bn' ? product.titleBn : product.title}
          </h4>
        </div>

        <div>
          {/* Stock Progress Bar for Flash Sale */}
          {isFlashSale && (
            <div className="mb-2">
              <div className="flex justify-between text-[10px] font-bold text-rose-600 dark:text-rose-400 mb-1">
                <span>{language === 'bn' ? 'মাত্র ৩ টি বাকি!' : 'Only 3 left!'}</span>
                <span>{language === 'bn' ? 'দ্রুত অর্ডার করুন' : 'Selling Fast'}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-rose-600 h-full rounded-full w-[80%] animate-pulse" />
              </div>
            </div>
          )}

          {/* Price Box */}
          <div className="flex items-baseline space-x-2 my-2">
            <span className="text-base sm:text-lg font-black text-[#0A2342] dark:text-[#E8C76A]">
              ৳{product.price.toLocaleString()}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-medium">
                ৳{product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Add to Cart Action */}
          <button
            onClick={() => addToCart(product)}
            className="w-full mt-2 bg-[#0A2342] hover:bg-[#07182E] active:bg-[#D4AF37] active:text-[#0A2342] text-[#D4AF37] border border-[#D4AF37]/40 font-black text-xs sm:text-xs py-2.5 sm:py-2 rounded-xl flex items-center justify-center space-x-1.5 shadow active:scale-95 transition-all cursor-pointer min-h-[42px]"
          >
            <ShoppingCart className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
            <span>{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
