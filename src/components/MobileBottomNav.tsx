import React from 'react';
import { Home, Grid, ShoppingBag, Heart, User } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { 
    language, 
    cartCount, 
    wishlist, 
    setIsCartOpen, 
    setIsCategoryModalOpen,
    setIsDashboardOpen, 
    setIsAuthOpen, 
    user,
    setSelectedCategory
  } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A2342]/95 backdrop-blur-md border-t border-[#D4AF37]/30 text-white shadow-2xl py-1 px-2 flex justify-around items-center pb-safe">
      {/* Home Button */}
      <button 
        onClick={() => {
          setSelectedCategory('all');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 text-slate-300 hover:text-[#D4AF37] active:scale-95 transition-all"
      >
        <Home className="w-5 h-5 text-[#D4AF37]" />
        <span className="text-[10px] font-medium mt-0.5">{language === 'bn' ? 'হোম' : 'Home'}</span>
      </button>

      {/* Categories Button */}
      <button 
        onClick={() => setIsCategoryModalOpen(true)}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 text-slate-300 hover:text-[#D4AF37] active:scale-95 transition-all"
      >
        <Grid className="w-5 h-5 text-[#E8C76A]" />
        <span className="text-[10px] font-medium mt-0.5">{language === 'bn' ? 'ক্যাটাগরি' : 'Categories'}</span>
      </button>

      {/* Cart Button */}
      <button 
        onClick={() => setIsCartOpen(true)}
        className="relative flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 text-slate-300 hover:text-[#D4AF37] active:scale-95 transition-all"
      >
        <div className="relative">
          <ShoppingBag className="w-5 h-5 text-[#D4AF37]" />
          {cartCount > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-amber-500 text-[#0A2342] text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium mt-0.5">{language === 'bn' ? 'কার্ট' : 'Cart'}</span>
      </button>

      {/* Wishlist Button */}
      <button 
        onClick={() => setIsDashboardOpen(true)}
        className="relative flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 text-slate-300 hover:text-[#D4AF37] active:scale-95 transition-all"
      >
        <div className="relative">
          <Heart className="w-5 h-5 text-[#E8C76A]" />
          {wishlist.length > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
              {wishlist.length}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium mt-0.5">{language === 'bn' ? 'উইশলিস্ট' : 'Wishlist'}</span>
      </button>

      {/* Account Button */}
      <button 
        onClick={() => user ? setIsDashboardOpen(true) : setIsAuthOpen(true)}
        className="flex flex-col items-center justify-center min-w-[50px] min-h-[48px] py-1 text-slate-300 hover:text-[#D4AF37] active:scale-95 transition-all"
      >
        <User className="w-5 h-5 text-[#D4AF37]" />
        <span className="text-[10px] font-medium mt-0.5">{user ? (language === 'bn' ? 'প্রোফাইল' : 'Profile') : (language === 'bn' ? 'লগইন' : 'Login')}</span>
      </button>
    </div>
  );
};
