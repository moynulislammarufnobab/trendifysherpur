import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  Sun, 
  Moon, 
  Globe, 
  ShieldCheck, 
  PhoneCall, 
  X, 
  Tag, 
  LayoutDashboard,
  MessageCircle,
  Menu
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Product } from '../types';

export const Header: React.FC = () => {
  const { 
    language, 
    toggleLanguage, 
    theme, 
    toggleTheme, 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsAuthOpen, 
    setIsDashboardOpen, 
    setIsAdminPanelOpen,
    user, 
    isAdmin, 
    products, 
    searchTerm, 
    setSearchTerm, 
    setSelectedProductForModal,
    t,
    siteSettings
  } = useApp();

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileSearchFocused, setIsMobileSearchFocused] = useState(false);

  // Filtered search products for real-time dropdown
  const searchResults: Product[] = searchTerm.trim() 
    ? products.filter(p => {
        const term = searchTerm.trim().toLowerCase();
        return (
          (p.title && p.title.toLowerCase().includes(term)) || 
          (p.titleBn && p.titleBn.toLowerCase().includes(term)) ||
          (p.category && p.category.toLowerCase().includes(term)) ||
          (p.description && p.description.toLowerCase().includes(term)) ||
          (p.descriptionBn && p.descriptionBn.toLowerCase().includes(term))
        );
      }).slice(0, 5)
    : [];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const grid = document.getElementById('products-grid');
    if (grid) {
      grid.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#0A2342] text-white shadow-xl transition-colors duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#07182E] text-[11px] py-0.5 px-3 border-b border-[#D4AF37]/20 flex justify-between items-center text-slate-300">
        <div className="flex items-center space-x-2 overflow-hidden text-ellipsis whitespace-nowrap">
          <span className="bg-[#D4AF37] text-[#0A2342] px-1.5 py-0.2 rounded font-bold uppercase text-[9px] tracking-wider animate-pulse">
            SHERPUR SPECIAL
          </span>
          <span className="truncate">
            {language === 'bn' 
              ? 'শেরপুর সদরে ২৪-৪৮ ঘণ্টায় ফ্রি ডেলিভারি!' 
              : 'Fast Delivery in Sherpur within 24-48 Hours!'}
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-3 text-[11px]">
          {siteSettings.bkashNumber ? (
            <>
              <a href={`tel:${siteSettings.bkashNumber}`} className="hover:text-[#D4AF37] flex items-center space-x-1 transition-colors">
                <PhoneCall className="w-3 h-3 text-[#D4AF37]" />
                <span>{siteSettings.bkashNumber}</span>
              </a>
              <span>|</span>
            </>
          ) : null}
          <a href={siteSettings.whatsappGroup} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] text-[#E8C76A] font-medium flex items-center space-x-1">
            <MessageCircle className="w-3 h-3" />
            <span>{language === 'bn' ? 'হোয়াটসঅ্যাপ গ্রুপ' : 'WhatsApp VIP Group'}</span>
          </a>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-5 py-1.5 flex items-center justify-between gap-2 sm:gap-4">
        {/* Brand Logo */}
        <div className="flex items-center space-x-2 cursor-pointer shrink-0" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#D4AF37] via-[#E8C76A] to-[#D4AF37] p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-[#0A2342] rounded-[6px] flex items-center justify-center text-[#D4AF37] font-black text-base tracking-tighter">
              TS
            </div>
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-[#E8C76A] bg-clip-text text-transparent leading-none">
              Trendify<span className="text-[#D4AF37]">Sherpur</span>
            </h1>
            <p className="text-[9px] text-[#E8C76A] tracking-wider font-semibold uppercase hidden sm:block">
              {language === 'bn' ? 'শেরপুরের ১ নম্বর লাক্সারি ই-কমার্স' : '#1 Luxury E-commerce in Sherpur'}
            </p>
          </div>
        </div>

        {/* Real-time Search Input with Live Dropdown */}
        <div className="flex-1 max-w-md relative hidden md:block">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
              placeholder={t('searchPlaceholder')}
              className="w-full bg-[#0E2F56] border border-[#D4AF37]/30 text-white placeholder-slate-400 text-xs rounded-full py-1.5 pl-9 pr-8 focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all shadow-inner"
            />
            <button type="submit" className="absolute left-3 top-2 text-[#D4AF37]">
              <Search className="w-4 h-4 text-[#D4AF37]" />
            </button>
            {searchTerm && (
              <button 
                type="button"
                onClick={() => setSearchTerm('')} 
                className="absolute right-3 top-2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </form>

          {/* Live Search Results Dropdown */}
          {isSearchFocused && searchResults.length > 0 && (
            <div className="absolute left-0 right-0 top-12 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-800 dark:text-slate-100 animate-fadeIn">
              <div className="p-2 text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 flex justify-between items-center">
                <span>{language === 'bn' ? 'খুঁজে পাওয়া পন্যসমূহ:' : 'Found Products:'}</span>
                <span className="text-[10px] text-[#D4AF37] font-bold">{searchResults.length} {language === 'bn' ? 'টি' : 'items'}</span>
              </div>
              {searchResults.map(prod => (
                <div 
                  key={prod.id}
                  onClick={() => {
                    setSelectedProductForModal(prod);
                    setIsSearchFocused(false);
                  }}
                  className="flex items-center space-x-3 p-3 hover:bg-amber-50 dark:hover:bg-slate-800 cursor-pointer transition-colors border-b last:border-0 border-slate-100 dark:border-slate-800"
                >
                  <img src={prod.images[0]} alt={prod.title} className="w-12 h-12 object-cover rounded-lg border border-slate-200" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                      {language === 'bn' ? (prod.titleBn || prod.title) : (prod.title || prod.titleBn)}
                    </h4>
                    <p className="text-xs text-[#D4AF37] font-extrabold">
                      ৳{prod.price.toLocaleString()} {prod.originalPrice > prod.price && <span className="text-slate-400 line-through text-[11px] font-normal ml-1">৳{prod.originalPrice.toLocaleString()}</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action Controls & Utilities */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Language Switcher */}
          <button 
            onClick={toggleLanguage} 
            className="flex items-center space-x-1 px-2 py-1 rounded-lg border border-[#D4AF37]/30 bg-[#0E2F56] hover:bg-[#D4AF37]/20 text-[11px] font-bold transition-all"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#E8C76A]">{language === 'bn' ? 'EN' : 'বাং'}</span>
          </button>

          {/* Theme Toggle */}
          <button 
            onClick={toggleTheme} 
            className="p-1.5 rounded-lg border border-[#D4AF37]/30 bg-[#0E2F56] hover:bg-[#D4AF37]/20 text-[#E8C76A] transition-all"
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Wishlist Button */}
          <button 
            onClick={() => setIsDashboardOpen(true)}
            className="relative p-1.5 rounded-lg hover:bg-white/10 text-slate-200 hover:text-[#D4AF37] transition-all hidden sm:flex items-center"
            title="Wishlist"
          >
            <Heart className="w-4 h-4" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </button>

          {/* Cart Drawer Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center space-x-1.5 bg-gradient-to-r from-[#D4AF37] to-[#E8C76A] text-[#0A2342] px-2.5 py-1.5 rounded-lg font-bold text-xs shadow hover:brightness-110 active:scale-95 transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">{t('viewCart')}</span>
            <span className="bg-[#0A2342] text-white text-[10px] font-black px-1.5 py-0.2 rounded-full ml-0.5">
              {cartCount}
            </span>
          </button>

          {/* Admin Button if Admin */}
          {isAdmin && (
            <button 
              onClick={() => setIsAdminPanelOpen(true)}
              className="hidden lg:flex items-center space-x-1 bg-amber-500/20 text-[#E8C76A] border border-[#D4AF37]/50 px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-[#D4AF37] hover:text-[#0A2342] transition-all"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
          )}

          {/* User Account / Login */}
          <button 
            onClick={() => user ? setIsDashboardOpen(true) : setIsAuthOpen(true)}
            className="flex items-center space-x-1 p-1.5 sm:px-2.5 sm:py-1 rounded-lg border border-white/20 hover:border-[#D4AF37] text-slate-200 hover:text-white transition-all text-xs"
          >
            <User className="w-4 h-4 text-[#D4AF37]" />
            <span className="hidden md:inline text-[11px] font-semibold truncate max-w-[90px]">
              {user ? user.displayName : (language === 'bn' ? 'লগইন' : 'Login')}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Search Input Bar */}
      <div className="md:hidden px-3 pb-2 relative">
        <form onSubmit={handleSearchSubmit} className="relative">
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsMobileSearchFocused(true)}
            onBlur={() => setTimeout(() => setIsMobileSearchFocused(false), 200)}
            placeholder={t('searchPlaceholder')}
            className="w-full bg-[#0E2F56] border border-[#D4AF37]/30 text-white placeholder-slate-400 text-xs rounded-full py-1.5 pl-8 pr-7 focus:outline-none focus:border-[#D4AF37]"
          />
          <button type="submit" className="absolute left-2.5 top-2 text-[#D4AF37]">
            <Search className="w-3.5 h-3.5 text-[#D4AF37]" />
          </button>
          {searchTerm && (
            <button type="button" onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2 text-slate-400">
              <X className="w-3 h-3" />
            </button>
          )}
        </form>

        {/* Mobile Live Search Results Dropdown */}
        {isMobileSearchFocused && searchResults.length > 0 && (
          <div className="absolute left-3 right-3 top-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-50 text-slate-800 dark:text-slate-100">
            <div className="p-2 text-xs font-semibold text-slate-400 bg-slate-50 dark:bg-slate-800/50 border-b dark:border-slate-800 flex justify-between items-center">
              <span>{language === 'bn' ? 'খুঁজে পাওয়া পন্যসমূহ:' : 'Found Products:'}</span>
              <span className="text-[10px] text-[#D4AF37] font-bold">{searchResults.length} {language === 'bn' ? 'টি' : 'items'}</span>
            </div>
            {searchResults.map(prod => (
              <div 
                key={prod.id}
                onClick={() => {
                  setSelectedProductForModal(prod);
                  setIsMobileSearchFocused(false);
                }}
                className="flex items-center space-x-3 p-2.5 hover:bg-amber-50 dark:hover:bg-slate-800 cursor-pointer border-b last:border-0 border-slate-100 dark:border-slate-800"
              >
                <img src={prod.images[0]} alt={prod.title} className="w-10 h-10 object-cover rounded-lg border border-slate-200" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {language === 'bn' ? (prod.titleBn || prod.title) : (prod.title || prod.titleBn)}
                  </h4>
                  <p className="text-[11px] text-[#D4AF37] font-black">
                    ৳{prod.price.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
