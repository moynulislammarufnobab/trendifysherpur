import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Phone, 
  User, 
  CreditCard, 
  CheckCircle2, 
  ShieldCheck, 
  Tag, 
  AlertCircle, 
  ArrowRight 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ShippingDetails, PaymentMethod } from '../types';

export const CheckoutModal: React.FC = () => {
  const { 
    isCheckoutOpen, 
    setIsCheckoutOpen, 
    cart, 
    cartSubtotal, 
    siteSettings, 
    placeOrder, 
    coupons,
    language,
    t,
    user
  } = useApp();

  const [fullName, setFullName] = useState(user?.displayName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [deliveryArea, setDeliveryArea] = useState<'inside' | 'outside'>('inside');
  const [address, setAddress] = useState(user?.address || '');
  const [notes, setNotes] = useState('');

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  const [senderPhone, setSenderPhone] = useState('');
  const [trxId, setTrxId] = useState('');

  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isCheckoutOpen) return null;

  const shippingFee = deliveryArea === 'inside' ? siteSettings.deliveryFeeInside : siteSettings.deliveryFeeOutside;

  // Coupon discount calculation
  let discountAmount = 0;
  if (appliedCoupon) {
    const c = coupons.find(item => item.code.toUpperCase() === appliedCoupon.toUpperCase());
    if (c) {
      if (c.discountType === 'percentage') {
        discountAmount = Math.round((cartSubtotal * c.discountValue) / 100);
      } else {
        discountAmount = c.discountValue;
      }
    }
  }

  const grandTotal = Math.max(0, cartSubtotal + shippingFee - discountAmount);

  const handleApplyCoupon = () => {
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    const found = coupons.find(c => c.code.toUpperCase() === code && c.active);

    if (!found) {
      setCouponError(language === 'bn' ? 'অকার্যকর কুপন কোড' : 'Invalid coupon code');
      return;
    }

    if (cartSubtotal < found.minSpend) {
      setCouponError(language === 'bn' ? `সর্বনিম্ন ৳${found.minSpend} টাকার অর্ডার প্রয়োজন` : `Minimum order ৳${found.minSpend} required`);
      return;
    }

    setAppliedCoupon(found.code);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !address) {
      alert(language === 'bn' ? 'অনুগ্রহ করে সব তথ্য সঠিকভাবে পূরণ করুন' : 'Please fill all required fields');
      return;
    }

    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && (!senderPhone || !trxId)) {
      alert(language === 'bn' ? 'অনুগ্রহ করে প্রেরকের নম্বর এবং Transaction ID (TrxID) প্রদান করুন' : 'Please provide Sender Phone & Transaction ID (TrxID)');
      return;
    }

    setIsSubmitting(true);
    try {
      const shipping: ShippingDetails = {
        fullName,
        phone,
        deliveryArea,
        address,
        notes,
      };

      await placeOrder(
        shipping, 
        paymentMethod, 
        paymentMethod === 'cod' ? undefined : senderPhone, 
        paymentMethod === 'cod' ? undefined : trxId, 
        appliedCoupon || undefined
      );

      setIsCheckoutOpen(false);
    } catch (err) {
      console.error(err);
      alert('Order placement failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="bg-[#0A2342] text-white px-6 py-4 flex justify-between items-center border-b border-[#D4AF37]/30">
          <h3 className="text-lg sm:text-xl font-black flex items-center space-x-2">
            <span className="w-2.5 h-5 bg-[#D4AF37] rounded-full" />
            <span>{language === 'bn' ? 'অর্ডার প্রস্তুত ও চেকআউট' : 'Checkout & Order Summary'}</span>
          </h3>
          <button 
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmitOrder} className="p-6 overflow-y-auto space-y-6">
          
          {/* Section 1: Customer Shipping Form */}
          <div className="space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0A2342] dark:text-[#E8C76A] flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
              <User className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'bn' ? '১. ডেলিভারি তথ্য (Shipping Details)' : '1. Shipping Details'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold mb-1">
                  {language === 'bn' ? 'গ্রাহকের নাম *' : 'Full Name *'}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: তানভীর আহমেদ' : 'e.g. Tanvir Ahmed'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs p-2.5 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold mb-1">
                  {language === 'bn' ? 'মোবাইল নম্বর *' : 'Phone Number *'}
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={language === 'bn' ? 'যেমন: 01712345678' : 'e.g. 01712345678'}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs p-2.5 rounded-xl focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>

            {/* Delivery Area Dropdown */}
            <div>
              <label className="block text-xs font-bold mb-1">
                {language === 'bn' ? 'ডেলিভারি এলাকা নির্ধারণ করুন *' : 'Select Delivery Area *'}
              </label>
              <select
                value={deliveryArea}
                onChange={(e: any) => setDeliveryArea(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs p-2.5 rounded-xl font-bold focus:outline-none focus:border-[#D4AF37]"
              >
                <option value="inside">{t('insideSherpur')}</option>
                <option value="outside">{t('outsideSherpur')}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1">
                {language === 'bn' ? 'সম্পূর্ণ ঠিকানা (বাসা/রোড/পাড়া/ইউনিয়ন) *' : 'Full Address *'}
              </label>
              <textarea
                required
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={language === 'bn' ? 'যেমন: শেরপুর সদর, নয়নপুর মোড়, বাড়ি নং ৪২/এ' : 'e.g. House 42, Nayanpur, Sherpur Sadar'}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs p-2.5 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              />
            </div>
          </div>

          {/* Section 2: Payment Gateways */}
          <div className="space-y-4 pt-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#0A2342] dark:text-[#E8C76A] flex items-center space-x-1.5 border-b border-slate-200 dark:border-slate-800 pb-2">
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              <span>{language === 'bn' ? '২. পেমেন্ট পদ্ধতি নির্বাচন করুন (Payment Method)' : '2. Select Payment Method'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* COD */}
              <label 
                onClick={() => setPaymentMethod('cod')}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'cod' 
                    ? 'border-[#D4AF37] bg-amber-50/50 dark:bg-slate-800/80 shadow' 
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-xs text-slate-900 dark:text-white">{t('cod')}</span>
                  {paymentMethod === 'cod' && <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  {language === 'bn' ? 'পন্য হাতে পেয়ে টাকা পরিশোধ করুন' : 'Pay when you receive items'}
                </p>
              </label>

              {/* bKash */}
              <label 
                onClick={() => setPaymentMethod('bkash')}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'bkash' 
                    ? 'border-pink-500 bg-pink-50/50 dark:bg-pink-950/20 shadow' 
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-xs text-pink-600 dark:text-pink-400">{t('bkash')}</span>
                  {paymentMethod === 'bkash' && <CheckCircle2 className="w-4 h-4 text-pink-600" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Send Money: <span className="font-mono font-bold text-slate-800 dark:text-white">{siteSettings.bkashNumber}</span>
                </p>
              </label>

              {/* Nagad */}
              <label 
                onClick={() => setPaymentMethod('nagad')}
                className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                  paymentMethod === 'nagad' 
                    ? 'border-orange-500 bg-orange-50/50 dark:bg-orange-950/20 shadow' 
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-extrabold text-xs text-orange-600 dark:text-orange-400">{t('nagad')}</span>
                  {paymentMethod === 'nagad' && <CheckCircle2 className="w-4 h-4 text-orange-600" />}
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Send Money: <span className="font-mono font-bold text-slate-800 dark:text-white">{siteSettings.nagadNumber}</span>
                </p>
              </label>
            </div>

            {/* Manual Payment Verification Box for bKash & Nagad */}
            {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-[#D4AF37]/40 space-y-3 animate-fadeIn">
                <div className="text-xs font-bold text-[#0A2342] dark:text-[#E8C76A]">
                  {paymentMethod === 'bkash' ? 'bKash Personal Send Money Instructions' : 'Nagad Personal Send Money Instructions'}:
                </div>
                <p className="text-xs text-slate-700 dark:text-slate-300">
                  {t('sendMoneyInstructions')}
                </p>
                <div className="p-2.5 bg-white dark:bg-slate-800 rounded-xl font-mono text-center text-sm font-black text-[#D4AF37] border border-amber-300/50">
                  {paymentMethod === 'bkash' ? siteSettings.bkashNumber : siteSettings.nagadNumber}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[11px] font-bold mb-1">
                      {language === 'bn' ? 'প্রেরকের বিকাশ/নগদ নম্বর *' : 'Sender Phone Number *'}
                    </label>
                    <input
                      type="tel"
                      required
                      value={senderPhone}
                      onChange={(e) => setSenderPhone(e.target.value)}
                      placeholder="e.g. 01954833730"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs p-2 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold mb-1">
                      {language === 'bn' ? 'ট্রানজেকশন আইডি (TrxID) *' : 'Transaction ID (TrxID) *'}
                    </label>
                    <input
                      type="text"
                      required
                      value={trxId}
                      onChange={(e) => setTrxId(e.target.value)}
                      placeholder="e.g. BKS9823X1Y"
                      className="w-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 text-xs p-2 rounded-xl uppercase font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 3: Coupon & Order Summary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
            <div className="flex justify-between">
              <span>{language === 'bn' ? 'পন্যের মূল্য (Subtotal):' : 'Subtotal:'}</span>
              <span className="font-bold">৳{cartSubtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>{language === 'bn' ? 'ডেলিভারি চার্জ:' : 'Shipping Fee:'}</span>
              <span className="font-bold">৳{shippingFee}</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between text-emerald-600 font-bold">
                <span>{language === 'bn' ? 'কুপন ডিসকাউন্ট:' : 'Coupon Discount:'}</span>
                <span>-৳{discountAmount}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-black text-[#0A2342] dark:text-[#E8C76A] border-t border-slate-200 dark:border-slate-700 pt-2">
              <span>{language === 'bn' ? 'সর্বমোট প্রদেয় মূল্য:' : 'Grand Total Payable:'}</span>
              <span>৳{grandTotal.toLocaleString()}</span>
            </div>
          </div>

          {/* Submit Order Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-[#D4AF37] via-[#E8C76A] to-[#D4AF37] text-[#0A2342] font-black py-4 rounded-2xl flex items-center justify-center space-x-2 shadow-2xl hover:brightness-110 active:scale-95 transition-all text-sm"
          >
            <span>{isSubmitting ? 'প্রসেসিং হচ্ছে...' : (language === 'bn' ? 'অর্ডার নিশ্চিত করুন' : 'Confirm Order')}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
