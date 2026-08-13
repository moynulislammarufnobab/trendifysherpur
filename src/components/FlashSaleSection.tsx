import React, { useState, useEffect } from 'react';
import { Flame, Clock, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ProductCard } from './ProductCard';

export const FlashSaleSection: React.FC = () => {
  const { products, language } = useApp();
  const flashSaleProducts = products.filter(p => p.isFlashSale);

  // Live countdown state
  const [timeLeft, setTimeLeft] = useState({ hours: 12, minutes: 45, seconds: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (flashSaleProducts.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-gradient-to-r from-[#0A2342] via-[#0E2F56] to-[#0A2342] rounded-3xl p-4 sm:p-6 border border-[#D4AF37]/40 shadow-2xl relative overflow-hidden">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-[#D4AF37]/20">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-rose-600 flex items-center justify-center text-white shadow-lg animate-pulse">
              <Flame className="w-7 h-7 fill-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                  HOT DEAL
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  {language === 'bn' ? 'ফ্ল্যাশ সেল - বিশেষ ছাড়!' : 'Flash Sale - Limited Time!'}
                </h3>
              </div>
              <p className="text-xs text-amber-200/80 font-medium mt-0.5">
                {language === 'bn' ? 'শেরপুর সদরে সবচেয়ে কম দামে পন্য কেনার সুবর্ণ সুযোগ' : 'Unbeatable lowest price guaranteed in Sherpur'}
              </p>
            </div>
          </div>

          {/* Countdown Clock Box */}
          <div className="flex items-center space-x-2 bg-[#07182E] px-4 py-2 rounded-2xl border border-[#D4AF37]/30 shadow-inner">
            <Clock className="w-4 h-4 text-[#D4AF37] animate-spin" />
            <span className="text-xs font-bold text-slate-300 mr-1">
              {language === 'bn' ? 'শেষ হতে বাকি:' : 'Ends In:'}
            </span>
            <div className="flex items-center space-x-1 font-mono font-black text-sm">
              <span className="bg-[#D4AF37] text-[#0A2342] px-2 py-1 rounded-lg">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="text-[#D4AF37] font-bold">:</span>
              <span className="bg-[#D4AF37] text-[#0A2342] px-2 py-1 rounded-lg">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="text-[#D4AF37] font-bold">:</span>
              <span className="bg-[#D4AF37] text-[#0A2342] px-2 py-1 rounded-lg">
                {String(timeLeft.seconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        </div>

        {/* Flash Sale Grid (2-col mobile / 4-col desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 pt-6">
          {flashSaleProducts.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} isFlashSale />
          ))}
        </div>
      </div>
    </section>
  );
};
