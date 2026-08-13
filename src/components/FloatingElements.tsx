import React, { useState, useEffect } from 'react';
import { ArrowUp, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const FloatingElements: React.FC = () => {
  const { siteSettings } = useApp();
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 sm:right-6 z-40 flex flex-col items-center space-y-3">
      {/* Direct WhatsApp Floating Chat Button */}
      <a
        href="https://wa.me/qr/B5HDB4MUYXU7A1"
        target="_blank"
        rel="noopener noreferrer"
        className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-2xl border-2 border-white flex items-center justify-center transition-all hover:scale-110 active:scale-95 group animate-bounce"
        title="WhatsApp Support Chat"
      >
        <MessageCircle className="w-7 h-7 fill-white text-emerald-500" />
        <span className="absolute right-14 bg-slate-900 text-white text-[11px] font-bold px-2.5 py-1 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
          Chat with Us
        </span>
      </a>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="w-10 h-10 rounded-full bg-[#0A2342] hover:bg-[#D4AF37] text-[#D4AF37] hover:text-[#0A2342] border border-[#D4AF37]/50 shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95"
          title="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};
