import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  CheckCircle2, 
  ShoppingCart, 
  Zap, 
  MessageSquare, 
  Plus, 
  Video, 
  User, 
  ThumbsUp 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cleanImageUrl, handleImageError } from '../lib/imageUtils';

export const ProductDetailsModal: React.FC = () => {
  const { 
    selectedProductForModal, 
    setSelectedProductForModal, 
    language, 
    addToCart, 
    setIsCheckoutOpen,
    reviews,
    addReview
  } = useApp();

  if (!selectedProductForModal) return null;

  const product = selectedProductForModal;
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.variants?.colors?.[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.variants?.sizes?.[0] || '');
  const [quantity, setQuantity] = useState(1);

  // Review submission state
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [newPhoto, setNewPhoto] = useState('');

  const productReviews = reviews.filter(r => r.productId === product.id);
  const discountPercent = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
    setSelectedProductForModal(null);
    setIsCheckoutOpen(true);
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedColor, selectedSize);
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    await addReview(product.id, newRating, newComment, newPhoto || undefined);
    setNewComment('');
    setNewPhoto('');
    setShowReviewForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 my-2 sm:my-8 overflow-hidden text-slate-900 dark:text-slate-100 max-h-[95vh] sm:max-h-[90vh] flex flex-col">
        {/* Sticky Modal Close Header */}
        <div className="sticky top-0 z-20 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="bg-[#D4AF37] text-[#0A2342] text-[10px] font-black px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full uppercase">
              {product.category}
            </span>
            <span className="text-[10px] sm:text-xs text-slate-500 font-semibold">
              ID: {product.id}
            </span>
          </div>
          <button 
            onClick={() => setSelectedProductForModal(null)}
            className="p-1.5 sm:p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 sm:space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Column */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <img 
                  src={cleanImageUrl(product.images[activeImageIndex] || product.images[0])} 
                  alt={product.title} 
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-full h-full object-cover object-center"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-lg uppercase shadow">
                    -{discountPercent}% OFF
                  </span>
                )}
              </div>

              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto pb-1">
                  {product.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                        idx === activeImageIndex ? 'border-[#D4AF37] scale-105 shadow-md' : 'border-slate-200 dark:border-slate-700 opacity-60'
                      }`}
                    >
                      <img src={cleanImageUrl(img)} alt="Thumbnail" referrerPolicy="no-referrer" onError={handleImageError} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details Column */}
            <div className="space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white leading-snug">
                  {language === 'bn' ? product.titleBn : product.title}
                </h2>

                {/* Rating & Stock Indicator */}
                <div className="flex items-center space-x-4 mt-2 text-sm">
                  <div className="flex items-center space-x-1 text-amber-500 font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                    <span className="text-slate-400 font-normal">({product.reviewCount} {language === 'bn' ? 'রিভিউ' : 'Reviews'})</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{product.inStock ? (language === 'bn' ? `স্টক আছে (${product.stockCount} টি)` : `In Stock (${product.stockCount} left)`) : 'Out of Stock'}</span>
                  </div>
                </div>
              </div>

              {/* BDT Price Box */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-baseline space-x-3">
                <span className="text-3xl font-black text-[#0A2342] dark:text-[#E8C76A]">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-base text-slate-400 line-through font-semibold">
                    ৳{product.originalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/40 px-2 py-0.5 rounded">
                  {language === 'bn' ? 'বিশেষ সেভিংস' : 'Special Savings'}
                </span>
              </div>

              {/* Color Selection */}
              {product.variants?.colors?.length > 0 && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    {language === 'bn' ? 'কালার সিলেক্ট করুন:' : 'Select Color:'} <span className="text-[#D4AF37] font-extrabold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.colors.map(color => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedColor === color
                            ? 'bg-[#0A2342] text-[#D4AF37] border-[#D4AF37] shadow'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.variants?.sizes?.length > 0 && product.variants.sizes[0] !== 'Standard' && product.variants.sizes[0] !== 'One Size' && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-2">
                    {language === 'bn' ? 'সাইজ সিলেক্ট করুন:' : 'Select Size:'} <span className="text-[#D4AF37] font-extrabold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.variants.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                          selectedSize === size
                            ? 'bg-[#0A2342] text-[#D4AF37] border-[#D4AF37] shadow'
                            : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="flex items-center space-x-4">
                <span className="text-xs font-bold uppercase text-slate-700 dark:text-slate-300">
                  {language === 'bn' ? 'পরিমাণ:' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xl overflow-hidden">
                  <button 
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-sm"
                  >
                    -
                  </button>
                  <span className="px-4 py-1.5 font-black text-sm">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(q => Math.min(product.stockCount || 10, q + 1))}
                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 font-bold text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons: Buy Now & Add to Cart */}
              <div className="grid grid-cols-2 gap-3 pt-2">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-[#0E2F56] hover:bg-[#0A2342] text-[#D4AF37] border border-[#D4AF37]/50 font-black py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow hover:shadow-lg transition-all"
                >
                  <ShoppingCart className="w-4 h-4 text-[#D4AF37]" />
                  <span className="text-xs sm:text-sm">{language === 'bn' ? 'কার্টে যোগ করুন' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E8C76A] to-[#D4AF37] text-[#0A2342] font-black py-3 px-4 rounded-2xl flex items-center justify-center space-x-2 shadow-xl hover:brightness-110 active:scale-95 transition-all"
                >
                  <Zap className="w-4 h-4 fill-[#0A2342]" />
                  <span className="text-xs sm:text-sm">{language === 'bn' ? 'এখনই কিনুন' : 'Buy Now'}</span>
                </button>
              </div>

              {/* Policy Badges */}
              <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-[10px] sm:text-xs">
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-slate-800/50 border border-amber-200/50 dark:border-slate-700 flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-[#D4AF37] mb-1" />
                  <span className="font-bold">{language === 'bn' ? '১০০% আসল প্রোডাক্ট' : '100% Authentic'}</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-slate-800/50 border border-amber-200/50 dark:border-slate-700 flex flex-col items-center">
                  <RotateCcw className="w-5 h-5 text-[#D4AF37] mb-1" />
                  <span className="font-bold">{language === 'bn' ? '৭ দিনের সহজ রিটার্ন' : '7 Days Return'}</span>
                </div>
                <div className="p-2 rounded-xl bg-amber-50 dark:bg-slate-800/50 border border-amber-200/50 dark:border-slate-700 flex flex-col items-center">
                  <Truck className="w-5 h-5 text-[#D4AF37] mb-1" />
                  <span className="font-bold">{language === 'bn' ? 'শেরপুরে দ্রুত ডেলিভারি' : 'Sherpur Fast Express'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Product Description Tab */}
          <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <h3 className="text-base font-extrabold text-[#0A2342] dark:text-[#E8C76A] mb-2">
              {language === 'bn' ? 'পন্যের বিস্তারিত বিবরণ:' : 'Product Description:'}
            </h3>
            <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
              {language === 'bn' ? product.descriptionBn : product.description}
            </p>
          </div>

          {/* Customer Reviews & Video Proofs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-base font-extrabold text-[#0A2342] dark:text-white flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#D4AF37]" />
                <span>{language === 'bn' ? 'গ্রাহকদের রিভিউ ও ছবিসমূহ' : 'Customer Reviews & Photos'} ({productReviews.length})</span>
              </h3>
              <button
                onClick={() => setShowReviewForm(!showReviewForm)}
                className="flex items-center space-x-1 bg-[#0A2342] text-[#D4AF37] px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-[#07182E]"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'bn' ? 'রিভিউ দিন' : 'Write Review'}</span>
              </button>
            </div>

            {/* Write Review Form */}
            {showReviewForm && (
              <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-amber-50 dark:bg-slate-800 border border-[#D4AF37]/30 space-y-3 animate-fadeIn">
                <h4 className="text-xs font-bold uppercase text-[#0A2342] dark:text-[#E8C76A]">
                  {language === 'bn' ? 'আপনার পজিটিভ অভিজ্ঞতা শেয়ার করুন' : 'Share Your Review'}
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold">{language === 'bn' ? 'রেটিং:' : 'Rating:'}</span>
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setNewRating(star)}
                      className="text-amber-400 p-1"
                    >
                      <Star className={`w-5 h-5 ${star <= newRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                    </button>
                  ))}
                </div>
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={language === 'bn' ? 'পন্য সম্পর্কে আপনার অভিজ্ঞতা লিখুন...' : 'Write your review about this product...'}
                  className="w-full p-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:border-[#D4AF37]"
                  rows={3}
                  required
                />
                <input
                  type="url"
                  value={newPhoto}
                  onChange={(e) => setNewPhoto(e.target.value)}
                  placeholder={language === 'bn' ? 'ছবির লিংক (অপশনাল)' : 'Photo URL (optional)'}
                  className="w-full p-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs"
                />
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowReviewForm(false)}
                    className="px-3 py-1.5 rounded-xl border text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#0A2342] text-[#D4AF37] text-xs font-bold shadow"
                  >
                    Submit Review
                  </button>
                </div>
              </form>
            )}

            {/* Existing Reviews List */}
            {productReviews.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {productReviews.map(rev => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <img src={rev.userAvatar} alt={rev.userName} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <h5 className="text-xs font-bold text-slate-900 dark:text-white">{rev.userName}</h5>
                          <span className="text-[10px] text-slate-400">{rev.createdAt}</span>
                        </div>
                      </div>
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                      {rev.comment}
                    </p>
                    {rev.photo && (
                      <img src={rev.photo} alt="Review attachment" className="w-20 h-20 object-cover rounded-xl border border-slate-200" />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic py-2">
                {language === 'bn' ? 'এখনও কোনো রিভিউ দেওয়া হয়নি। প্রথম রিভিউটি লিখুন!' : 'No reviews yet for this product. Be the first to review!'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
