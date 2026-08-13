import React, { useState } from 'react';
import { X, Trash2, ShoppingCart, Tag, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cleanImageUrl, handleImageError } from '../lib/imageUtils';

export const CartDrawer: React.FC = () => {
  const { 
    isCartOpen, 
    setIsCartOpen, 
    cart, 
    removeFromCart, 
    updateCartQuantity, 
    cartSubtotal, 
    cartCount,
    language,
    setIsCheckoutOpen,
    coupons,
    t
  } = useApp();

  const [couponInput, setCouponInput] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isCartOpen) return null;

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === code && c.active);

    if (!found) {
      setCouponError(language === 'bn' ? 'অকার্যকর কুপন কোড' : 'Invalid Coupon Code');
      return;
    }

    if (cartSubtotal < found.minSpend) {
      setCouponError(language === 'bn' ? `সর্বনিম্ন ৳${found.minSpend} টাকার পন্য অর্ডার করতে হবে` : `Minimum order ৳${found.minSpend} required`);
      return;
    }

    setAppliedCouponCode(found.code);
    setCouponError('');
  };

  // Calculate discount if coupon applied
  let discountAmount = 0;
  if (appliedCouponCode) {
    const activeC = coupons.find(c => c.code === appliedCouponCode);
    if (activeC) {
      if (activeC.discountType === 'percentage') {
        discountAmount = Math.round((cartSubtotal * activeC.discountValue) / 100);
      } else {
        discountAmount = activeC.discountValue;
      }
    }
  }

  const grandTotal = Math.max(0, cartSubtotal - discountAmount);

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-end animate-fadeIn">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 h-full shadow-2xl flex flex-col justify-between text-slate-900 dark:text-slate-100 border-l border-slate-200 dark:border-slate-800">
        
        {/* Drawer Header */}
        <div className="p-4 sm:p-6 bg-[#0A2342] text-white flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="w-5 h-5 text-[#D4AF37]" />
            <h3 className="text-lg font-black tracking-tight">
              {language === 'bn' ? 'আপনার শপিং কার্ট' : 'Your Shopping Cart'}
            </h3>
            <span className="bg-[#D4AF37] text-[#0A2342] text-xs font-black px-2 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drawer Cart Items */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-4">
          {cart.length > 0 ? (
            cart.map((item, idx) => (
              <div 
                key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
                className="flex space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/70 relative"
              >
                <img 
                  src={cleanImageUrl(item.product.images[0])} 
                  alt={item.product.title} 
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="w-16 h-16 object-cover rounded-xl border border-slate-200"
                />

                <div className="flex-1 min-w-0 pr-6">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {language === 'bn' ? item.product.titleBn : item.product.title}
                  </h4>

                  <div className="text-[10px] text-slate-500 font-medium space-x-2 mt-0.5">
                    {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                    {item.selectedSize && <span>Size: {item.selectedSize}</span>}
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-black text-[#0A2342] dark:text-[#E8C76A]">
                      ৳{(item.product.price * item.quantity).toLocaleString()}
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-lg overflow-hidden text-xs">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1, item.selectedColor, item.selectedSize)}
                        className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2 font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1, item.selectedColor, item.selectedSize)}
                        className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Remove Item */}
                <button
                  onClick={() => removeFromCart(item.product.id, item.selectedColor, item.selectedSize)}
                  className="absolute top-2 right-2 text-rose-500 hover:text-rose-700 p-1"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-slate-400">
              <ShoppingCart className="w-16 h-16 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-bold">{t('cartEmpty')}</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="mt-4 bg-[#0A2342] text-[#D4AF37] text-xs font-bold px-4 py-2 rounded-xl"
              >
                {language === 'bn' ? 'শপিং শুরু করুন' : 'Start Shopping'}
              </button>
            </div>
          )}
        </div>

        {/* Drawer Footer & Coupon Input */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-6 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 space-y-3">
            {/* Coupon Code Input */}
            <div>
              <div className="flex space-x-2">
                <div className="relative flex-1">
                  <Tag className="w-4 h-4 text-[#D4AF37] absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder={language === 'bn' ? 'কুপন কোড (যেমন TRENDIFY10)' : 'Coupon Code'}
                    className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs pl-9 pr-3 py-2 rounded-xl focus:outline-none uppercase font-bold"
                  />
                </div>
                <button
                  onClick={handleApplyCoupon}
                  className="bg-[#0A2342] text-[#D4AF37] text-xs font-bold px-4 py-2 rounded-xl hover:bg-[#07182E]"
                >
                  {language === 'bn' ? 'এপ্লাই' : 'Apply'}
                </button>
              </div>

              {couponError && <p className="text-[10px] text-rose-600 font-bold mt-1">{couponError}</p>}
              {appliedCouponCode && (
                <p className="text-[10px] text-emerald-600 font-bold mt-1">
                  ✓ {language === 'bn' ? `কুপন '${appliedCouponCode}' প্রয়োগ করা হয়েছে!` : `Coupon '${appliedCouponCode}' applied!`}
                </p>
              )}
            </div>

            {/* Calculations */}
            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300 border-t border-slate-200 dark:border-slate-700 pt-3">
              <div className="flex justify-between">
                <span>{language === 'bn' ? 'সাবটোটাল:' : 'Subtotal:'}</span>
                <span className="font-bold">৳{cartSubtotal.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold">
                  <span>{language === 'bn' ? 'কুপন ডিসকাউন্ট:' : 'Discount:'}</span>
                  <span>-৳{discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-black text-[#0A2342] dark:text-[#E8C76A] pt-1">
                <span>{language === 'bn' ? 'মোট মূল্য:' : 'Grand Total:'}</span>
                <span>৳{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E8C76A] to-[#D4AF37] text-[#0A2342] font-black py-3.5 rounded-2xl flex items-center justify-center space-x-2 shadow-xl hover:brightness-110 active:scale-95 transition-all text-sm"
            >
              <span>{t('checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
