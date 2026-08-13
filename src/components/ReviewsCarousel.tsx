import React from 'react';
import { Star, Quote, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cleanImageUrl, handleImageError } from '../lib/imageUtils';

export const ReviewsCarousel: React.FC = () => {
  const { reviews, language } = useApp();

  if (reviews.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center space-x-1.5 bg-[#D4AF37]/20 text-[#0A2342] dark:text-[#E8C76A] px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Quote className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>{language === 'bn' ? 'কাস্টমার ফিডব্যাক' : 'Social Proof'}</span>
        </div>
        <h3 className="text-2xl font-black text-[#0A2342] dark:text-white">
          {language === 'bn' ? 'শেরপুরের সন্তুষ্ট গ্রাহকদের রিভিউ' : 'Customer Reviews in Sherpur'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {language === 'bn' ? '১০০% অরিজিনাল পন্য ও দ্রুত হোম ডেলিভারির নিশ্চয়তা' : 'Real reviews from verified buyers'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.slice(0, 3).map(rev => (
          <div key={rev.id} className="relative bg-white dark:bg-slate-800/90 rounded-3xl p-6 border border-slate-200 dark:border-slate-700/80 shadow-lg flex flex-col justify-between hover:border-[#D4AF37] transition-all">
            <div>
              {/* Star Rating */}
              <div className="flex text-amber-400 mb-3">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>

              {/* Comment text */}
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 italic leading-relaxed mb-4">
                "{rev.comment}"
              </p>
            </div>

            <div className="flex items-center space-x-3 pt-4 border-t border-slate-100 dark:border-slate-700">
              <img src={cleanImageUrl(rev.userAvatar)} alt={rev.userName} referrerPolicy="no-referrer" onError={handleImageError} className="w-10 h-10 rounded-full object-cover border-2 border-[#D4AF37]" />
              <div>
                <h5 className="text-xs font-bold text-slate-900 dark:text-white flex items-center space-x-1">
                  <span>{rev.userName}</span>
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                </h5>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  {language === 'bn' ? 'ভেরিফাইড ক্রেতা' : 'Verified Purchase'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
