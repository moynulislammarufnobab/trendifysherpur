import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, ShoppingCart, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { cleanImageUrl, handleImageError } from '../lib/imageUtils';

export const HeroCarousel: React.FC = () => {
  const { banners, language, setSelectedCategory } = useApp();
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeBanners = banners.filter(b => b.active);

  useEffect(() => {
    if (activeBanners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [activeBanners.length]);

  if (activeBanners.length === 0) return null;

  const currentBanner = activeBanners[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 pt-2.5 sm:pt-4 pb-2">
      <div className="relative h-[190px] sm:h-[320px] md:h-[420px] w-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#D4AF37]/30 bg-[#0A2342]">
        {/* Banner Image with Overlay */}
        <div className="absolute inset-0">
          <img 
            src={cleanImageUrl(currentBanner.image)} 
            alt={currentBanner.title}
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover object-center transition-all duration-700 ease-out transform scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A2342] via-[#0A2342]/85 to-transparent sm:to-transparent" />
        </div>

        {/* Content Box */}
        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-12 max-w-2xl text-white z-10">
          {/* Tag Badge: Smart Choice / Trendy Choice */}
          <div className="inline-flex items-center space-x-1 bg-[#D4AF37] text-[#0A2342] px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-black uppercase tracking-wider shadow-md w-fit mb-1.5 sm:mb-3">
            <Sparkles className="w-3 h-3 fill-[#0A2342]" />
            <span>{currentBanner.tag}</span>
          </div>

          <h2 className="text-base sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight mb-1 sm:mb-2 drop-shadow-md line-clamp-2">
            {language === 'bn' ? currentBanner.titleBn : currentBanner.title}
          </h2>

          <p className="text-[11px] sm:text-base text-slate-200 mb-3 sm:mb-6 line-clamp-2 max-w-lg font-medium leading-snug">
            {language === 'bn' ? currentBanner.subtitleBn : currentBanner.subtitle}
          </p>

          <div className="flex items-center space-x-3">
            <button 
              onClick={() => {
                if (currentBanner.linkCategory) {
                  setSelectedCategory(currentBanner.linkCategory);
                }
                const grid = document.getElementById('products-grid');
                if (grid) grid.scrollIntoView({ behavior: 'smooth' });
              }}
              className="flex items-center space-x-1.5 bg-gradient-to-r from-[#D4AF37] via-[#E8C76A] to-[#D4AF37] text-[#0A2342] px-3.5 py-1.5 sm:px-6 sm:py-3 rounded-xl sm:rounded-2xl font-black text-xs sm:text-sm shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{language === 'bn' ? 'অফারটি দেখুন' : 'Shop Now'}</span>
              <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <button 
          onClick={handlePrev}
          className="absolute left-1.5 sm:left-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#0A2342]/60 hover:bg-[#D4AF37] text-white hover:text-[#0A2342] border border-white/20 flex items-center justify-center transition-all"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <button 
          onClick={handleNext}
          className="absolute right-1.5 sm:right-3 top-1/2 -translate-y-1/2 z-20 w-7 h-7 sm:w-10 sm:h-10 rounded-full bg-[#0A2342]/60 hover:bg-[#D4AF37] text-white hover:text-[#0A2342] border border-white/20 flex items-center justify-center transition-all"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex space-x-2">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all ${
                idx === currentIndex ? 'w-8 bg-[#D4AF37]' : 'w-2 bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
